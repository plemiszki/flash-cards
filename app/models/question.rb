class Question < ActiveRecord::Base

  validates :name, presence: true, uniqueness: true

  has_many :quiz_questions, dependent: :destroy

end
