class SpanishAdjective < ActiveRecord::Base

  validates_presence_of :english, :masculine, :feminine, :masculine_plural, :feminine_plural
  validates_uniqueness_of :english, scope: :masculine, message: '/ Spanish combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

end
