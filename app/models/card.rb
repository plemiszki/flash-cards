class Card < ActiveRecord::Base

  validates :question, :answer, presence: true

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

end
