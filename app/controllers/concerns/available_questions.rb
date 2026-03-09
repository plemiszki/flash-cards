module AvailableQuestions
  extend ActiveSupport::Concern

  QUESTION_MODELS_MAP = {
    'Hindi - Single Noun': 'Noun',
    'Hindi - Verb': 'Verb',
    'Hindi - Single Adjective': 'Adjective',
    'Spanish - Single Noun': 'SpanishNoun',
    'Spanish - Verb': 'SpanishVerb',
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
    'French - Verb - Infinitive': 'FrenchVerb',
    'French - Single Adjective, Any Agreement': 'FrenchAdjective',
    'French - Misc Word': 'FrenchMisc',
    'French - City': 'FrenchCity',
    'French - Country': 'FrenchCountry',
    'French - Country Gender': 'FrenchCountry',
  }

  def get_chained_amounts(quiz_questions:)
    quiz_questions.each do |quiz_question|
      if quiz_question.chained
        chain_root_position = quiz_question.chain_root.position
        chain_root = quiz_questions[chain_root_position]
        quiz_question.chained_amount = chain_root.all_highlighted? ? chain_root.available : chain_root.amount
      else
        quiz_question.chained_amount = 0
      end
    end
    quiz_questions
  end

  def get_available_questions(quiz_questions:, quiz:)
    highlighted_card_ids = Highlight.where(highlightable_type: 'Card').pluck(:highlightable_id)

    quiz_questions.each do |quiz_question|
      case quiz_question.question.name
      when 'Card'
        if quiz_question.tag_id
          tagged_card_ids = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: 'Card').includes(:cardtagable).map(&:cardtagable).pluck(:id)
          quiz_question.highlighted_count = (tagged_card_ids & highlighted_card_ids).count
          quiz_question.non_highlighted_count = (tagged_card_ids - highlighted_card_ids).count
          quiz_question.available = tagged_card_ids.count
        else
          card_count = Card.count
          quiz_question.highlighted_count = highlighted_card_ids.count
          quiz_question.non_highlighted_count = card_count - highlighted_card_ids.count
          quiz_question.available = card_count
        end
      when 'Spanish - Single Noun',
        'Spanish - Verb',
        'Spanish - Single Adjective',
        'Spanish - Misc Word',
        'French - Noun Singular',
        'French - Noun Plural',
        'French - Noun Gender',
        'French - Adjective Masculine Singular',
        'French - Adjective Masculine Plural',
        'French - Adjective Feminine Singular',
        'French - Adjective Feminine Plural',
        'French - Single Noun with Article, Singular or Plural',
        'French - Verb - Infinitive',
        'French - Single Adjective, Any Agreement',
        'French - Misc Word',
        'French - City',
        'French - Country',
        'French - Country Gender'
        model_name = QUESTION_MODELS_MAP[quiz_question.question.name.to_sym]
        highlighted_ids = Highlight.where(highlightable_type: model_name).pluck(:highlightable_id)
        if quiz_question.tag_id
          tagged_ids = CardTag.where(tag_id: quiz_question.tag_id, cardtagable_type: model_name).pluck(:cardtagable_id)
          available_count = quiz_question.all_highlighted? ? (tagged_ids & highlighted_ids).count : tagged_ids.count
        else
          available_count = quiz_question.all_highlighted? ? highlighted_ids.count : model_name.constantize.count
        end
        quiz_question.available = available_count
        quiz_question.highlighted_count = 0
        quiz_question.non_highlighted_count = 0
      else
        quiz_question.highlighted_count = 0
        quiz_question.non_highlighted_count = 0
        quiz_question.available = 0
      end
    end

    quiz_questions
  end
end
