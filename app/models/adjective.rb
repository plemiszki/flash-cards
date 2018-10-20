class Adjective < ActiveRecord::Base

  validates :english, :masculine, :feminine, :masculine_plural, presence: true

end
