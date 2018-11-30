class Tag < ActiveRecord::Base

  validates :name, presence: true

  has_many :card_tags, dependent: :destroy

end
