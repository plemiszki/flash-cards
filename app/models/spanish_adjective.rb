class SpanishAdjective < ActiveRecord::Base

  validates_presence_of :english, :masculine, :feminine, :masculine_plural, :feminine_plural
  validates_uniqueness_of :english, scope: :masculine, message: '/ Spanish combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    SpanishAdjective.where(english: self.english)
  end

  def conjugate(gender:, use_plural: false)
    if gender == 1 || gender == :male
      use_plural ? masculine_plural : masculine
    else
      use_plural ? feminine_plural : feminine
    end
  end

end
