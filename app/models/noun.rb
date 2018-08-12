class Noun < ActiveRecord::Base

  validates :english, :english_plural, :foreign, :foreign_plural, presence: true

end
