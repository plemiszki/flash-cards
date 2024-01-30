class FrenchVerb < ActiveRecord::Base

  SCHEMA = Pathname.new(Rails.root.join('config', 'schemas', 'french_verb.json')).to_s

  validates_presence_of :english, :french
  validates_uniqueness_of :english, scope: :french, message: '/ French combo already used'
  validates :forms, json: { schema: JSON.parse(File.read(SCHEMA)) }

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

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

end
