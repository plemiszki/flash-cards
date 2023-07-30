class SpanishVerb < ActiveRecord::Base

  SCHEMA = Pathname.new(Rails.root.join('config', 'schemas', 'spanish_verb.json')).to_s

  validates_presence_of :english, :spanish
  validates_uniqueness_of :english, scope: :spanish, message: '/ Spanish combo already used'
  validates :forms, json: { schema: JSON.parse(File.read(SCHEMA)) }

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def stem
    reflexive? ? spanish[0..-5] : spanish[0..-3]
  end

  def synonyms
    SpanishVerb.where(english: self.english)
  end

  def just_synonyms
    synonyms - [self]
  end

  def english_conjugation(spanish_pronoun: nil)
    english_with_s = english.ends_with?('s') ? "#{english}es" : "#{english}s"
    if spanish_pronoun.present?
      spanish_pronoun.in?(['yo', 'tú', 'nosotros', 'nosotras', 'ellos', 'ellas']) ? english : english_with_s
    end
  end

  def english_continuous
    words = english.split(' ')
    first_word = words[0]
    first_word = first_word.ends_with?('e') && !first_word.ends_with?('ee') && first_word != 'be' ? "#{first_word[0..-2]}ing" : "#{first_word}ing"
    ([first_word] + words[1..-1]).join(' ')
  end

  def present_continuous
    case ending
    when 'er', 'ir', 'ír'
      "#{stem}iendo"
    when 'ar'
      "#{stem}ando"
    end
  end

  def ending
    if reflexive?
      spanish[-4..-3]
    else
      spanish[-2..-1]
    end
  end

  def reflexive?
    spanish.ends_with?('se')
  end

end
