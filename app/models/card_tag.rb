class CardTag < ActiveRecord::Base

  validates :card_id, :tag_id, presence: true

end
