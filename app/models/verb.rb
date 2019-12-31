class Verb < ActiveRecord::Base

  validates_presence_of :english, :infinitive
  validates_uniqueness_of :english, scope: :infinitive, message: '/ Hindi combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def english_imperfective(subject, use_negative)
    if ['I', 'You', 'We', 'Those', 'They', 'These'].include?(subject.capitalize)
      english
    elsif ['This', 'That', 'He', 'She', 'It'].include?(subject.capitalize)
      use_negative ? english : (english_irregular_imperfective.present? ? english_irregular_imperfective : "#{english}s")
    else
      raise "unknown subject: #{subject}"
    end
  end

  def hindi_formal
    if irregular_imperative_formal.empty?
      ['ा', 'ो', 'आ'].include?(hindi_stem[-1]) ? "#{hindi_stem}इए" : "#{hindi_stem}िए"
    else
      irregular_imperative_formal
    end
  end

  def hindi_imperfective(gender, plural)
    if gender == 'M'
      plural ? "#{hindi_stem}ते" : "#{hindi_stem}ता"
    else
      "#{hindi_stem}ती"
    end
  end

  def hindi_informal
    if irregular_imperative_informal.empty?
      ['ा', 'ो', 'आ'].include?(hindi_stem[-1]) ? "#{hindi_stem}ओ" : "#{hindi_stem}ो"
    else
      irregular_imperative_informal
    end
  end

  def hindi_stem
    infinitive[0...-2]
  end

  def hindi_oblique
    "#{hindi_stem}ने"
  end

  def postposition_trans
    {
      से: 'se',
      को: 'ko'
    }[postposition.to_sym]
  end

  def transliterated_formal
    if irregular_imperative_formal_transliterated.empty?
      "#{transliterated_stem}ie"
    else
      irregular_imperative_formal_transliterated
    end
  end

  def transliterated_imperfective(gender, plural)
    if gender == 'M'
      plural ? "#{transliterated_stem}te" : "#{transliterated_stem}ta"
    else
      "#{transliterated_stem}ti"
    end
  end

  def transliterated_informal
    if irregular_imperative_informal_transliterated.empty?
      "#{transliterated_stem}o"
    else
      irregular_imperative_informal_transliterated
    end
  end

  def transliterated_stem
    transliterated_infinitive[0...-2]
  end

  def transliterated_oblique
    "#{transliterated_stem}ne"
  end

end
