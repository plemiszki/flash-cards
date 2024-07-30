class FrenchMisc < ActiveRecord::Base

  validates_presence_of :english, :french
  validates_uniqueness_of :english, scope: :french, message: '/ French combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    FrenchMisc.where(english: self.english)
  end

  def just_synonyms
    synonyms - [self]
  end

end
