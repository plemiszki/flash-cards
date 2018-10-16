class Quiz < ActiveRecord::Base

  validates :name, presence: true

  has_many :quiz_questions

end
