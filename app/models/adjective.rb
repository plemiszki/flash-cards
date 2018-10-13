class Adjective < ActiveRecord::Base

  validates :english, :masculine, :feminine, presence: true

end
