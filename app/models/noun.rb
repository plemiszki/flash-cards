class Noun < ActiveRecord::Base

  validates_presence_of :english, :english_plural, :foreign, :foreign_plural, :gender
  validates_uniqueness_of :english, scope: :foreign, message: '/ Hindi combo already used'

end
