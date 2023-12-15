class FrenchCity < ActiveRecord::Base

  validates_presence_of :english, :french
  validates_uniqueness_of :english, scope: :french, message: '/ French combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

end
