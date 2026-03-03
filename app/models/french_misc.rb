class FrenchMisc < ActiveRecord::Base

  validates_presence_of :english, :french
  validates_uniqueness_of :english, scope: :french, message: '/ French combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags
  has_many :highlights, as: :highlightable, dependent: :destroy

  def synonyms
    FrenchMisc.where(english: self.english)
  end

  def just_synonyms
    synonyms - [self]
  end

end
