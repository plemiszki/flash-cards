class Adjective < ActiveRecord::Base

  validates_presence_of :english, :masculine, :feminine, :masculine_plural
  validates_uniqueness_of :english, scope: :masculine, message: '/ Hindi combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

end
