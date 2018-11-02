class Quiz < ActiveRecord::Base

  validates :name, presence: true

  has_many :quiz_questions
  has_many :questions, through: :quiz_questions

  def run
    result = []
    @nouns = Noun.all.to_a.shuffle
    @verbs = Verb.all.to_a.shuffle
    @adjectives = Adjective.all.to_a.shuffle
    @cards = Card.all.to_a.shuffle
    quiz_questions.each do |quiz_question|
      question = quiz_question.question
      quiz_question.amount.times do
        check_if_anything_empty
        case question.name
        when 'Single Noun'
          noun = @nouns.pop
          plural = (rand(2) == 1)
          result << {
            question: (plural ? noun.english_plural.capitalize : noun.english.capitalize),
            answers: [
              (plural ? noun.transliterated_plural : noun.transliterated),
              (plural ? noun.foreign_plural : noun.foreign)
            ]
          }
        when 'Single Verb'
          verb = @verbs.pop
          result << {
            question: verb.english.capitalize,
            answers: [
              verb.transliterated_infinitive,
              verb.infinitive
            ]
          }
        when 'Single Adjective'
          adjective = @adjectives.pop
          result << {
            question: adjective.english.capitalize,
            answers: [
              adjective.transliterated_masculine,
              adjective.masculine
            ]
          }
        when 'Subject is a Noun'
          noun = @nouns.pop
          subject_objects = get_subject_object(get_random_english_subject)
          question_subject_object = subject_objects.sample
          result << {
            question: "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{a_or_an(noun[:english])} #{noun[:english]}.",
            answers: subject_objects.map do |hash|
              ["#{hash[:transliterated]} #{noun[:transliterated]} #{hash[:transliterated_be]}",
              "#{hash[:transliterated]} ek #{noun[:transliterated]} #{hash[:transliterated_be]}"]
            end.flatten.uniq
          }
        when 'Subject are Nouns'
          #
        when 'Subject is an Adjective'
          adjective = @adjectives.pop
        when 'Subject is an Adjective Noun'
          noun = @nouns.pop
          adjective = @adjectives.pop
        when 'Noun is an Adjective'
          noun = @nouns.pop
          adjective = @adjectives.pop
        when 'Card'
          # tagged_cards = @cards.select { |card| card.tags.map(&:id).include?(quiz_question.tag_id) }
          card = @cards.pop
          result << {
            question: card.question,
            answers: [card.answer],
            textbox: card.answer.include?("\n")
          }
        end
      end
    end
    result
  end

  private

  def check_if_anything_empty
    @nouns = Noun.all.to_a.shuffle if @nouns.empty?
    @verbs = Verb.all.to_a.shuffle if @verbs.empty?
    @adjectives = Adjective.all.to_a.shuffle if @adjectives.empty?
    @cards = Card.all.to_a.shuffle if @cards.empty?
  end

  def get_random_english_subject
    ['I', 'You', 'He', 'She', 'It', 'This', 'That', 'We', 'They', 'These', 'Those'][rand(11)]
  end

  def a_or_an(input)
    input.starts_with?('a') ? 'an' : 'a'
  end

  def get_subject_object(english_subject)
    case english_subject
    when 'I'
      [{
        english: 'I',
        english_be: 'am',
        hindi: 'मैं',
        hindi_be: 'हूँ',
        transliterated: 'mai',
        transliterated_be: 'hu'
      }]
    when 'You'
      [
        {
          english: 'you',
          english_be: 'are',
          hindi: 'तुम',
          hindi_be: 'हो',
          transliterated: 'tum',
          transliterated_be: 'ho'
        },
        {
          english: 'you',
          english_be: 'are',
          hindi: 'आप',
          hindi_be: 'हैं',
          transliterated: 'ap',
          transliterated_be: 'hai'
        }
      ]
    when 'He', 'She', 'It'
      [
        {
          english: 'he',
          english_be: 'is',
          hindi: 'यह',
          hindi_be: 'है',
          transliterated: 'yah',
          transliterated_be: 'hai'
        },
        {
          english: 'she',
          english_be: 'is',
          hindi: 'यह',
          hindi_be: 'है',
          transliterated: 'yah',
          transliterated_be: 'hai'
        },
        {
          english: 'it',
          english_be: 'is',
          hindi: 'यह',
          hindi_be: 'है',
          transliterated: 'yah',
          transliterated_be: 'hai'
        },
        {
          english: 'he',
          english_be: 'is',
          hindi: 'वह',
          hindi_be: 'है',
          transliterated: 'vah',
          transliterated_be: 'hai'
        },
        {
          english: 'she',
          english_be: 'is',
          hindi: 'वह',
          hindi_be: 'है',
          transliterated: 'vah',
          transliterated_be: 'hai'
        },
        {
          english: 'it',
          english_be: 'is',
          hindi: 'वह',
          hindi_be: 'है',
          transliterated: 'vah',
          transliterated_be: 'hai'
        }
      ]
    when 'We'
      [
        {
          english: 'we',
          english_be: 'are',
          hindi: 'हम',
          hindi_be: 'हैं',
          transliterated: 'ham',
          transliterated_be: 'hai'
        }
      ]
    when 'This'
      [
        {
          english: 'this',
          english_be: 'is',
          hindi: 'यह',
          hindi_be: 'है',
          transliterated: 'yah',
          transliterated_be: 'hai'
        }
      ]
    when 'That'
      [
        {
          english: 'that',
          english_be: 'is',
          hindi: 'वह',
          hindi_be: 'है',
          transliterated: 'vah',
          transliterated_be: 'hai'
        }
      ]
    when 'They', 'These'
      [
        {
          english: 'they',
          english_be: 'are',
          hindi: 'ये',
          hindi_be: 'हैं',
          transliterated: 'ye',
          transliterated_be: 'hai'
        },
        {
          english: 'these',
          english_be: 'are',
          hindi: 'ये',
          hindi_be: 'हैं',
          transliterated: 'ye',
          transliterated_be: 'hai'
        }
      ]
    when 'Those'
      [
        {
          english: 'those',
          english_be: 'are',
          hindi: 'वे',
          hindi_be: 'हैं',
          transliterated: 've',
          transliterated_be: 'hai'
        }
      ]
    end
  end

end
