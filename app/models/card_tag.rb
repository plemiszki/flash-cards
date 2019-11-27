class CardTag < ActiveRecord::Base

  validates :cardtagable_id, :tag_id, presence: true
  validates :cardtagable_id, uniqueness: { scope: [:cardtagable_type, :tag_id] }

  belongs_to :tag
  belongs_to :cardtagable, polymorphic: true

end
