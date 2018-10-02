class Noun < ActiveRecord::Base

  validates :english, :english_plural, :foreign, :foreign_plural, :gender, presence: true

end
