class CardTag < ActiveRecord::Base

  validates :cardtagable_id, :tag_id, presence: true

  belongs_to :tag
  belongs_to :cardtagable, polymorphic: true

end
