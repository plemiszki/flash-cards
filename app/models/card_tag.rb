class CardTag < ActiveRecord::Base

  validates :card_id, :tag_id, presence: true

  belongs_to :card
  belongs_to :tag, optional: true

end
