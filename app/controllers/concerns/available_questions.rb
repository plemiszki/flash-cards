module AvailableQuestions
  extend ActiveSupport::Concern

  QUESTION_MODELS_MAP = {
    'Hindi - Single Noun': 'Noun',
    'Hindi - Single Verb': 'Verb',
    'Hindi - Single Adjective': 'Adjective',
    'Spanish - Single Noun': 'SpanishNoun',
    'Spanish - Single Verb': 'SpanishVerb',
    'Spanish - Single Adjective': 'SpanishAdjective',
    'Spanish - Misc Word': 'SpanishMisc',
    'French - Single Noun': 'FrenchNoun',
    'French - Single Verb': 'FrenchVerb',
    'French - Single Adjective': 'FrenchAdjective',
    'French - Misc Word': 'FrenchMisc',
  }

  def get_available_questions(quiz_questions:, quiz:)
    result = {}
    archived_tag_id = Tag.find_by_name('Archived').id
    needs_attention_tag_id = Tag.find_by_name('Needs Attention').id

    archived_card_ids = CardTag.where(tag_id: archived_tag_id, cardtagable_type: 'Card').map(&:cardtagable_id)
    quiz_questions.each do |quiz_question|
      case quiz_question.question.name
      when 'Card'
        if quiz_question.tag_id
          tagged_card_ids = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: 'Card').includes(:cardtagable).map(&:cardtagable).pluck(:id)
          result[quiz_question.id] = {
            unarchived: (tagged_card_ids - archived_card_ids).count,
            archived: (tagged_card_ids & archived_card_ids).count,
            available: tagged_card_ids.count,
          }
        else
          card_count = Card.count
          result[quiz_question.id] = {
            unarchived: card_count - archived_card_ids.count,
            archived: archived_card_ids.count,
            available: card_count,
          }
        end
      when 'Spanish - Single Noun',
      'Spanish - Single Verb',
      'Spanish - Single Adjective',
      'Spanish - Misc Word',
      'French - Single Noun',
      'French - Single Verb',
      'French - Single Adjective',
      'French - Misc Word'
        model_name = QUESTION_MODELS_MAP[quiz_question.question.name.to_sym]
        if quiz_question.tag_id
          available_count = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: model_name).includes(:cardtagable).map(&:cardtagable).count
        else
          available_count = model_name.constantize.count
        end
        result[quiz_question.id] = {
          available: available_count,
          unarchived: 0,
          archived: 0,
        }
      else
        result[quiz_question.id] = {
          unarchived: 0,
          archived: 0,
          available: 0,
        }
      end
    end

    result
  end

end
