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
          @noun = @nouns.pop
          plural = (rand(2) == 1)
          result << {
            question: (plural ? @noun.english_plural.capitalize : @noun.english.capitalize),
            answers: all_synonyms([
              (plural ? @noun.transliterated_plural : @noun.transliterated),
              (plural ? @noun.foreign_plural : @noun.foreign)
            ])
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
          @noun = @nouns.pop
          subject_objects = get_subject_object(get_random_single_english_subject)
          question_subject_object = subject_objects.sample
          result << {
            question: "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{a_or_an(@noun[:english])} #{@noun[:english]}.",
            answers: all_synonyms(subject_objects.map do |hash|
              [
                "#{hash[:transliterated]} #{@noun[:transliterated]} #{hash[:transliterated_be]}",
                "#{hash[:hindi]} #{@noun[:foreign]} #{hash[:hindi_be]}",
                "#{hash[:transliterated]} ek #{@noun[:transliterated]} #{hash[:transliterated_be]}",
                "#{hash[:hindi]} एक #{@noun[:foreign]} #{hash[:hindi_be]}"
              ]
            end.flatten.uniq)
          }
        when 'Subject are Nouns'
          @noun = @nouns.pop
          subject_objects = get_subject_object(get_random_plural_english_subject)
          question_subject_object = subject_objects.sample
          result << {
            question: "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{@noun[:english_plural]}.",
            answers: all_synonyms(subject_objects.map do |hash|
              [
                "#{hash[:transliterated]} #{@noun[:transliterated_plural]} #{hash[:transliterated_be]}",
                "#{hash[:hindi]} #{@noun[:foreign_plural]} #{hash[:hindi_be]}"
              ]
            end.flatten.uniq)
          }
        when 'Subject is Adjective'
          adjective = @adjectives.pop
          subject_objects = get_subject_object(get_random_english_subject)
          question_subject_object = subject_objects.sample
          transliterated_adjectives, hindi_adjectives = proper_adjective_forms({ adjective: adjective, subject: question_subject_object[:english] })
          hindi_answers = subject_objects.map do |hash|
            hindi_adjectives.map do |adj|
              "#{hash[:hindi]} #{adj} #{hash[:hindi_be]}"
            end
          end.flatten.uniq
          transliterated_answers = subject_objects.map do |hash|
            transliterated_adjectives.map do |adj|
              "#{hash[:transliterated]} #{adj} #{hash[:transliterated_be]}"
            end
          end.flatten.uniq
          result << {
            question: "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{adjective[:english]}.",
            answers: hindi_answers + transliterated_answers
          }
        when 'Subject is a Adjective Noun'
          @noun = @nouns.pop
          adjective = @adjectives.pop
          subject_objects = get_subject_object(get_random_single_english_subject)
          question_subject_object = subject_objects.sample
          result << {
            question: "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{a_or_an(adjective[:english])} #{adjective[:english]} #{@noun[:english]}.",
            answers: all_synonyms(subject_objects.map do |hash|
              [
                "#{hash[:transliterated]} #{@noun[:gender] == 1 ? adjective[:transliterated_masculine] : adjective[:transliterated_feminine]} #{@noun[:transliterated]} #{hash[:transliterated_be]}",
                "#{hash[:hindi]} #{@noun[:gender] == 1 ? adjective[:masculine] : adjective[:feminine]} #{@noun[:foreign]} #{hash[:hindi_be]}",
                "#{hash[:transliterated]} ek #{@noun[:gender] == 1 ? adjective[:transliterated_masculine] : adjective[:transliterated_feminine]} #{@noun[:transliterated]} #{hash[:transliterated_be]}",
                "#{hash[:hindi]} एक #{@noun[:gender] == 1 ? adjective[:masculine] : adjective[:feminine]} #{@noun[:foreign]} #{hash[:hindi_be]}"
              ]
            end.flatten.uniq)
          }
        when 'Subject are Adjective Nouns'
          @noun = @nouns.pop
          adjective = @adjectives.pop
          subject_objects = get_subject_object(get_random_plural_english_subject)
          question_subject_object = subject_objects.sample
          result << {
            question: "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{adjective[:english]} #{@noun[:english_plural]}.",
            answers: all_synonyms(subject_objects.map do |hash|
              [
                "#{hash[:transliterated]} #{@noun[:gender] == 1 ? adjective[:transliterated_masculine_plural] : adjective[:transliterated_feminine]} #{@noun[:transliterated_plural]} #{hash[:transliterated_be]}",
                "#{hash[:hindi]} #{@noun[:gender] == 1 ? adjective[:masculine_plural] : adjective[:feminine]} #{@noun[:foreign_plural]} #{hash[:hindi_be]}"
              ]
            end.flatten.uniq)
          }
        when 'Noun Gender'
          noun = @nouns.pop
          result << {
            question: noun.foreign,
            answers: [
              noun.gender == 1 ? 'm' : 'f'
            ]
          }
        when 'Noun is Adjective'
          @noun = @nouns.pop
          adjective = @adjectives.pop
          use_plural = [true, false].sample
          if use_plural
            english_subject = ['The', 'These', 'Those'].sample
          else
            english_subject = ['The', 'This', 'That'].sample
          end
          subject_object = english_subject == 'The' ? nil : get_subject_object(english_subject).first
          english_subject = english_subject == 'The' ? 'The' : subject_object[:english]
          transliterated_subject = english_subject == 'The' ? '' : subject_object[:transliterated] + ' '
          hindi_subject = english_subject == 'The' ? '' : subject_object[:hindi] + ' '
          single_question = "#{english_subject.capitalize} #{@noun[:english]} is #{adjective[:english]}."
          plural_question = "#{english_subject.capitalize} #{@noun[:english_plural]} are #{adjective[:english]}."
          single_answers = [
            "#{transliterated_subject}#{@noun[:transliterated]} #{@noun[:gender] == 1 ? adjective[:transliterated_masculine] : adjective[:transliterated_feminine]} hai",
            "#{hindi_subject}#{@noun[:foreign]} #{@noun[:gender] == 1 ? adjective[:masculine] : adjective[:feminine]} है"
          ]
          plural_answers = [
            "#{transliterated_subject}#{@noun[:transliterated_plural]} #{@noun[:gender] == 1 ? adjective[:transliterated_masculine_plural] : adjective[:transliterated_feminine]} hai",
            "#{hindi_subject}#{@noun[:foreign_plural]} #{@noun[:gender] == 1 ? adjective[:masculine_plural] : adjective[:feminine]} हैं"
          ]
          result << {
            question: use_plural ? plural_question : single_question,
            answers: all_synonyms([
              use_plural ? plural_answers : single_answers
            ].flatten)
          }
        when 'Card'
          if quiz_question.tag_id
            tagged_cards = []
            until !tagged_cards.empty? do
              tagged_cards = @cards.select { |card| card.tags.map(&:id).include?(quiz_question.tag_id) }
              if tagged_cards.empty?
                @cards += Card.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
              end
            end
            card = tagged_cards.sample
            @cards.reject! { |c| c == card }
          else
            card = @cards.pop
          end
          result << {
            question: card.question,
            answers: [card.answer],
            textbox: card.answer.include?("\n")
          }
        end
      end
    end
    result.shuffle
  end

  private

  def all_synonyms(answers)
    synonyms = @noun.synonyms
    result = answers.map do |answer|
      synonyms.map do |synonym|
        answer.gsub(@noun.foreign, synonym.foreign).gsub(@noun.transliterated, synonym.transliterated)
      end
    end
    result.flatten.uniq
  end

  def check_if_anything_empty
    @nouns = Noun.all.to_a.shuffle if @nouns.empty?
    @verbs = Verb.all.to_a.shuffle if @verbs.empty?
    @adjectives = Adjective.all.to_a.shuffle if @adjectives.empty?
    @cards = Card.all.to_a.shuffle if @cards.empty?
  end

  def get_random_single_english_subject
    ['I', 'You', 'He', 'She', 'It', 'This', 'That'][rand(7)]
  end

  def get_random_plural_english_subject
    get_random_english_subject(true)
  end

  def get_random_english_subject(plural = false)
    ['We', 'They', 'These', 'Those', 'I', 'You', 'He', 'She', 'It', 'This', 'That'][plural ? rand(4) : rand(11)]
  end

  def a_or_an(input)
    input.starts_with?('a', 'e', 'i', 'o', 'u') ? 'an' : 'a'
  end

  def proper_adjective_forms(args)
    if args[:subject]
      case args[:subject]
      when 'I', 'you', 'it', 'this', 'that'
        result = [
          [
            args[:adjective].transliterated_masculine,
            args[:adjective].transliterated_feminine
          ],
          [
            args[:adjective].masculine,
            args[:adjective].feminine
          ]
        ]
      when 'he'
        result = [
          [
            args[:adjective].transliterated_masculine
          ],
          [
            args[:adjective].masculine
          ]
        ]
      when 'she'
        result = [
          [
            args[:adjective].transliterated_feminine
          ],
          [
            args[:adjective].feminine
          ]
        ]
      when 'we', 'they', 'these', 'those'
        result = [
          [
            args[:adjective].transliterated_masculine_plural,
            args[:adjective].transliterated_feminine
          ],
          [
            args[:adjective].masculine_plural,
            args[:adjective].feminine
          ]
        ]
      end
    end
    result
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
    when 'They'
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
          english: 'they',
          english_be: 'are',
          hindi: 'वे',
          hindi_be: 'हैं',
          transliterated: 've',
          transliterated_be: 'hai'
        }
      ]
    when 'These'
      [
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
