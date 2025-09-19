class FrenchVerb < ActiveRecord::Base

  SCHEMA = Pathname.new(Rails.root.join('config', 'schemas', 'french_verb.json')).to_s

  REFLEXIVE_PRONOUN_MAP = {
    "je" => "me",
    "tu" => "te",
    "il" => "se",
    "nous" => "nous",
    "vous" => "vous",
    "ils" => "se"
  }

  validates_presence_of :english, :french
  validates_uniqueness_of :english, scope: :french, message: '/ French combo already used'
  validates :forms, json: { schema: JSON.parse(File.read(SCHEMA)) }

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def self.fetch_missing_data!(verbose: false)
    errors = []
    self.all.each do |french_verb|
      begin
        french_verb.fetch_missing_data!(verbose: verbose) if french_verb.missing_data?
      rescue => error
        errors << french_verb.french
      end
    end
    p "ERRORS:"
    p errors
  end

  def synonyms
    FrenchVerb.where(english: self.english)
  end

  def just_synonyms
    synonyms - [self]
  end

  def english_present_continuous
    words = english.split(' ')
    first_word = words[0]
    first_word = first_word.ends_with?('e') && !first_word.ends_with?('ee') && first_word != 'be' ? "#{first_word[0..-2]}ing" : "#{first_word}ing"
    ([first_word] + words[1..-1]).join(' ')
  end

  def present(subject:)
    form = forms["present"][subject]
    vowel_sound = French.vowel_sound?(form[0])
    if reflexive?
      reflexive_pronoun = REFLEXIVE_PRONOUN_MAP[subject]
      if vowel_sound
        "#{subject} #{reflexive_pronoun[0]}'#{form}.".capitalize
      else
        "#{subject} #{reflexive_pronoun} #{form}.".capitalize
      end
    else
      if vowel_sound
        "#{subject[0]}'#{form}.".capitalize
      else
        "#{subject} #{form}.".capitalize
      end
    end
  end

  def missing_data?
    missing_keys = ["present", "past_perfect", "future", "imperative", "conditional"] - forms.keys
    return true if missing_keys.present?
    if forms.keys.include?("present")
      return true if (["je", "tu", "il", "nous", "vous", "ils"] - forms["present"].keys).present?
    end
    if forms.keys.include?("conditional")
      return true if (["je", "tu", "il", "nous", "vous", "ils"] - forms["conditional"].keys).present?
    end
    if forms.keys.include?("imperative")
      return true if (["tu", "nous", "vous"] - forms["present"].keys).present?
    end
    if forms.keys.include?("future")
      return true if (["je", "tu", "il", "nous", "vous", "ils"] - forms["future"].keys).present?
    end
    if forms.keys.include?("past_perfect")
      return true if (["participle"] - forms["past_perfect"].keys).present?
    end
  end

  def fetch_missing_data!(verbose: false)
    p "fetching data for #{self.french}" if verbose
    data = Hash.new { |h,k| h[k] = {} }

    response = HTTParty.get("https://en.wiktionary.org/w/api.php", query: {
      action: 'parse',
      page: self.french,
      format: 'json',
      prop: 'text'
    })
    html = response.dig('parse', 'text', '*')
    doc = Nokogiri::HTML(html)

    french_section = FrenchVerb.find_french_section(doc, self.french)

    if french_section.nil?
      p "missing french section for #{self.french}" if verbose
      throw "missing french section"
    end

    table = french_section
      .map { |el| el.at_css('table.roa-inflection-table') }
      .compact
      .first

    if table.nil?
      p "table not found for #{self.french}" if verbose
      throw "missing conjugation table"
    end

    past_participle = table.at_css('span[title="participe passé"]').parent.next_element.at_css('a').attributes["title"].value
    data[:past_perfect][:participle] = past_participle

    present_row_header = table.at_css('span[title="présent"]').parent
    td = present_row_header.next_element
    [:je, :tu, :il, :nous, :vous, :ils].each do |subject|
      if td.at_css('a')
        data[:present][subject] = td.at_css('a').attributes['title'].value
      end
      td = td.next_element
    end

    future_row_header = table.at_css('span[title="futur simple"]').parent
    td = future_row_header.next_element
    [:je, :tu, :il, :nous, :vous, :ils].each do |subject|
      link_tags = td.css('a')
      if link_tags.count
        data[:future][subject] = link_tags.last.attributes['title'].value
      end
      td = td.next_element
    end

    conditional_row_header = table.at_css('span[title="conditionnel présent"]').parent
    td = conditional_row_header.next_element
    [:je, :tu, :il, :nous, :vous, :ils].each do |subject|
      link_tags = td.css('a')
      if link_tags.count
        data[:conditional][subject] = link_tags.last.attributes['title'].value
      end
      td = td.next_element
    end

    imperative_row_header = table.css('span').find { |node| node.text.strip == 'simple' }.parent
    td_je = imperative_row_header.next_element
    td_tu = td_je.next_element
    data[:imperative][:tu] = td_tu.css('a').last.attributes['title'].value
    td_il = td_tu.next_element
    td_nous = td_il.next_element
    data[:imperative][:nous] = td_nous.css('a').last.attributes['title'].value
    td_vous = td_nous.next_element
    data[:imperative][:vous] = td_vous.css('a').last.attributes['title'].value

    p data if verbose

    update!(url: "https://en.wiktionary.org/wiki/#{self.french}#French", forms: data)
  end

  private

  def self.find_french_section(doc, word)
    french_header = doc.css('h2#French').first

    unless french_header.present?
      p "french section not found for #{word}"
      return nil
    end

    french_header_parent_div = french_header.parent

    # grab everything until the next heading section
    elements = []
    sibling = french_header_parent_div.next_element
    while sibling && !sibling['class'].to_s.split.include?('mw-heading2')
      elements << sibling
      sibling = sibling.next_element
    end

    elements
  end

end
