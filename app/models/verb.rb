class Verb < ActiveRecord::Base

  validates :english, :infinitive, presence: true

end
