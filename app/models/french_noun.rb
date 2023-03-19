class FrenchNoun < ActiveRecord::Base

  validates_presence_of :english, :english_plural, :french, :french_plural, :gender
  validates_uniqueness_of :english, scope: :french, message: '/ French combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    FrenchNoun.where(english: self.english)
  end

  def just_synonyms
    synonyms - [self]
  end

  def male?
    gender == 1
  end

  def female?
    gender == 2
  end

end
