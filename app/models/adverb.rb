class Adverb < ActiveRecord::Base

  validates_presence_of :english, :transliterated, :foreign
  validates_uniqueness_of :english, scope: :foreign, message: '/ Hindi combo already used'

end
