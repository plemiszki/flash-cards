class QuizQuestion < ActiveRecord::Base

  validates :question_id, presence: true
  validates :quiz_id, presence: true
  validates :amount, presence: true

  belongs_to :quiz
  belongs_to :question

end
