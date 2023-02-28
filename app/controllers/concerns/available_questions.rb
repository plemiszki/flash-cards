module AvailableQuestions
  extend ActiveSupport::Concern

  QUESTION_MODELS_MAP = {
    'Hindi - Single Noun': 'Noun',
    'Hindi - Single Verb': 'Verb',
    'Hindi - Single Adjective': 'Adjective',
    'Spanish - Single Noun': 'SpanishNoun',
    'Spanish - Single Verb': 'SpanishVerb',
    'Spanish - Single Adjective': 'SpanishAdjective',
    'Spanish - Misc Word': 'SpanishMisc'
  }

  def get_available_questions(quiz_questions:, quiz:)
    result = {
      active: 0,
      inactive: 0,
    }
    archived_tag_id = Tag.find_by_name('Archived').id
    needs_attention_tag_id = Tag.find_by_name('Needs Attention').id

    archived_card_ids = CardTag.where(tag_id: archived_tag_id, cardtagable_type: 'Card').map(&:cardtagable_id)
    quiz_questions.each do |quiz_question|
      case quiz_question.question.name
      when 'Card'
        tagged_card_ids = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: 'Card').includes(:cardtagable).map(&:cardtagable).pluck(:id)
        result[quiz_question.id] = {
          active: (tagged_card_ids - archived_card_ids).count,
          inactive: (tagged_card_ids & archived_card_ids).count
        }
      when 'Spanish - Single Noun'
      when 'Spanish - Single Verb'
      when 'Spanish - Single Adjective'
      when 'Spanish - Misc Word'
        model_name = QUESTION_MODELS_MAP[quiz_question.question.name.to_sym]
        tagged_ids = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: model_name).includes(:cardtagable).map(&:cardtagable).pluck(:id)
        result[quiz_question.id] = {
          active: tagged_ids.count,
          inactive: model_name.constantize.count(),
        }
      else
        result[quiz_question.id] = {
          active: 0,
          inactive: 0,
        }
      end
    end

    result
  end

end
