class MatchBin < ActiveRecord::Base

  validates :name, :card_id, presence: true

  belongs_to :card
  has_many :match_items, -> { order(:name) }, dependent: :destroy

end
