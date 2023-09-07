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
    'French - Noun Singular': 'FrenchNoun',
    'French - Noun Plural': 'FrenchNoun',
    'French - Noun Gender': 'FrenchNoun',
    'French - Adjective Masculine Singular': 'FrenchAdjective',
    'French - Adjective Masculine Plural': 'FrenchAdjective',
    'French - Adjective Feminine Singular': 'FrenchAdjective',
    'French - Adjective Feminine Plural': 'FrenchAdjective',
    'French - Single Noun with Article, Singular or Plural': 'FrenchNoun',
    'French - Single Verb, Infinitive': 'FrenchVerb',
    'French - Single Adjective, Any Agreement': 'FrenchAdjective',
    'French - Misc Word': 'FrenchMisc',
  }

  def get_chained_amounts(quiz_questions:)
    quiz_questions.each do |quiz_question|
      if quiz_question.chained
        chain_root_position = quiz_question.chain_root.position
        chain_root = quiz_questions[chain_root_position]
        quiz_question.chained_amount = chain_root.use_all_available ? chain_root.available : chain_root.amount
      else
        quiz_question.chained_amount = 0
      end
    end
    quiz_questions
  end

  def get_available_questions(quiz_questions:, quiz:)
    archived_tag_id = Tag.find_by_name('Archived').id
    needs_attention_tag_id = Tag.find_by_name('Needs Attention').id

    archived_card_ids = CardTag.where(tag_id: archived_tag_id, cardtagable_type: 'Card').map(&:cardtagable_id)

    quiz_questions.each do |quiz_question|
      case quiz_question.question.name
      when 'Card'
        if quiz_question.tag_id
          tagged_card_ids = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: 'Card').includes(:cardtagable).map(&:cardtagable).pluck(:id)
          quiz_question.unarchived = (tagged_card_ids - archived_card_ids).count
          quiz_question.archived = (tagged_card_ids & archived_card_ids).count
          quiz_question.available = tagged_card_ids.count
        else
          card_count = Card.count
          quiz_question.unarchived = card_count - archived_card_ids.count
          quiz_question.archived = archived_card_ids.count
          quiz_question.available = card_count
        end
      when 'Spanish - Single Noun',
        'Spanish - Single Verb',
        'Spanish - Single Adjective',
        'Spanish - Misc Word',
        'French - Noun Singular',
        'French - Noun Plural',
        'French - Noun Gender',
        'French - Single Noun with Article, Singular or Plural',
        'French - Single Verb, Infinitive',
        'French - Single Adjective, Any Agreement',
        'French - Misc Word'
        model_name = QUESTION_MODELS_MAP[quiz_question.question.name.to_sym]
        if quiz_question.tag_id
          available_count = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: model_name).includes(:cardtagable).map(&:cardtagable).count
        else
          available_count = model_name.constantize.count
        end
        quiz_question.available = available_count
        quiz_question.unarchived = 0
        quiz_question.archived = 0
      else
        quiz_question.unarchived = 0
        quiz_question.archived = 0
        quiz_question.available = 0
      end
    end

    quiz_questions
  end
end
