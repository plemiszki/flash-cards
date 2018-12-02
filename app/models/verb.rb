class Verb < ActiveRecord::Base

  validates_presence_of :english, :infinitive
  validates_uniqueness_of :english, scope: :infinitive, message: '/ Hindi combo already used'

end
