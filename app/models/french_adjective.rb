class FrenchAdjective < ActiveRecord::Base

  validates_presence_of :english, :masculine, :feminine, :masculine_plural, :feminine_plural
  validates_uniqueness_of :english, scope: :masculine, message: '/ French combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    FrenchAdjective.where(english: self.english)
  end

  def just_synonyms
    synonyms - [self]
  end

  def conjugate(gender:, use_plural: false)
    if gender == 1 || gender == :male
      use_plural ? masculine_plural : masculine
    else
      use_plural ? feminine_plural : feminine
    end
  end

end
