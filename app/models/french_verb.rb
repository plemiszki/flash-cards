class FrenchVerb < ActiveRecord::Base

  # SCHEMA = Pathname.new(Rails.root.join('config', 'schemas', 'french_verb.json')).to_s

  validates_presence_of :english, :spanish
  validates_uniqueness_of :english, scope: :spanish, message: '/ French combo already used'
  # validates :forms, json: { schema: JSON.parse(File.read(SCHEMA)) }

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    FrenchVerb.where(english: self.english)
  end

  def just_synonyms
    synonyms - [self]
  end

end
