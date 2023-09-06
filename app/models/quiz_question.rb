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

end
