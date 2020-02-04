module AvailableQuestions
  extend ActiveSupport::Concern

  def get_available_questions(quiz_questions:, quiz:)
    archived_tag_id = Tag.find_by_name('Archived').id
    archived_card_ids = CardTag.where(tag_id: archived_tag_id, cardtagable_type: 'Card').map(&:cardtagable_id)
    available_questions = {}
    quiz_questions.each do |quiz_question|
      case quiz_question.question.name
      when 'Card'
        tagged_card_ids = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: 'Card').includes(:cardtagable).map(&:cardtagable).pluck(:id)
        available_questions[quiz_question.id] = {
          unarchived: (tagged_card_ids - archived_card_ids).count,
          archived: (tagged_card_ids & archived_card_ids).count
        }
      else
        type = {
          'Hindi - Single Noun': 'Noun',
          'Hindi - Single Verb': 'Verb',
          'Hindi - Single Adjective': 'Adjective',
          'Spanish - Single Noun': 'SpanishNoun',
          'Spanish - Single Verb': 'SpanishVerb',
          'Spanish - Single Adjective': 'SpanishAdjective'
        }[quiz_question.question.name.to_sym]
        tagged_ids = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: type).includes(:cardtagable).map(&:cardtagable).pluck(:id)
        available_questions[quiz_question.id] = tagged_ids.count
      end
    end
    available_questions
  end

end
