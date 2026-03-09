class QuizQuestion < ActiveRecord::Base

  validates :question_id, presence: true
  validates :quiz_id, presence: true
  validates_numericality_of :amount, greater_than_or_equal_to: 0, only_integer: true
  validate :first_question_no_chain, unless: :reordering?

  enum :quiz_question_type, { manual_amount: 0, all_highlighted: 1, everything: 3 }

  belongs_to :quiz
  belongs_to :tag, optional: true

  has_many :quiz_question_tags, dependent: :destroy

  def question
    Question.find(question_id)
  end

  attr_accessor :highlighted_count, :non_highlighted_count, :available, :chained_amount, :reordering

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
    all_highlighted? ? (question.name == 'Card' ? highlighted_count : available) : amount
  end

  def get_amount
    return chain_root.get_amount if chained
    return amount if manual_amount?
    return count_tagged_entities if everything?
    if all_highlighted?
      highlighted_ids = Highlight.where(highlightable_type: question.entity).pluck(:highlightable_id)
      count_tagged_entities(intersect_with: highlighted_ids, all_when_no_tags: true)
    end
  end

  private

  def count_tagged_entities(intersect_with: nil, exclude: nil, all_when_no_tags: false)
    return 0 unless question.entity
    tag_ids = quiz_question_tags.map(&:tag_id)
    entity_ids = if tag_ids.empty?
      return 0 unless all_when_no_tags
      question.entity.constantize.all.pluck(:id)
    else
      CardTag.where(tag_id: tag_ids, cardtagable_type: question.entity).pluck(:cardtagable_id).uniq
    end
    entity_ids &= intersect_with if intersect_with
    entity_ids -= exclude if exclude
    entity_ids.count
  end

end
