class QuizQuestion < ActiveRecord::Base

  validates :question_id, presence: true
  validates :quiz_id, presence: true
  validates_numericality_of :amount, greater_than_or_equal_to: 1, only_integer: true

  belongs_to :quiz
  belongs_to :question
  belongs_to :tag

end
