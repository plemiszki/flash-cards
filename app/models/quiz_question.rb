class QuizQuestion < ActiveRecord::Base

  validates :question_id, presence: true
  validates :quiz_id, presence: true
  validates_numericality_of :amount, greater_than_or_equal_to: 0, only_integer: true
  validate :first_question_no_chain, unless: :reordering?

  belongs_to :quiz
  belongs_to :question
  belongs_to :tag, optional: true

  attr_accessor :unarchived, :archived, :available, :chained_amount, :reordering

  def first_question_no_chain
    if position.zero? && chained
      errors.add(:position, "can't be chained")
    end
  end

  def reordering?
    @reordering
  end

  def chain_root
    return nil if chained == false
    map = Quiz.find(quiz_id).quiz_questions.order(:position).pluck(:chained)
    index = position
    until index == 0
      break if map[index] == false
      index -= 1
    end
    QuizQuestion.find_by(quiz_id: quiz_id, position: index)
  end

  def children
    result = []
    quiz_questions = QuizQuestion.where(quiz_id: quiz_id).where("position > #{position}").order(:position)
    quiz_questions.each do |quiz_question|
      break if quiz_question.chained == false
      result << quiz_question
    end
    result
  end

  def get_quiz_run_amount
    return 0 if chained
    use_all_available ? (question.name == 'Card' ? unarchived : available) : amount
  end

end
