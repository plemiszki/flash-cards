class SpanishVerb < ActiveRecord::Base

  SCHEMA = Pathname.new(Rails.root.join('config', 'schemas', 'spanish_verb.json')).to_s

  validates_presence_of :english, :spanish
  validates_uniqueness_of :english, scope: :spanish, message: '/ Spanish combo already used'
  validates :forms, json: { schema: SCHEMA }

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

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

end
