class Highlight < ActiveRecord::Base

  validates :highlightable_id, :highlightable_type, presence: true

  belongs_to :highlightable, polymorphic: true

end
