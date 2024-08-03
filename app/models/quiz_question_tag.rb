class QuizQuestionTag < ActiveRecord::Base

  validates :tag_id, :quiz_question_id, presence: true

  belongs_to :quiz_question
  belongs_to :tag

end
