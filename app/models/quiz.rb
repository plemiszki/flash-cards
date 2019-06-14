class Quiz < ActiveRecord::Base

  validates :name, presence: true

  has_many :quiz_questions, -> { order(:id) }
  has_many :questions, through: :quiz_questions

  def run
    result = []
    @nouns = []
    @verbs = []
    @adjectives = []
    @adverbs = []
    @cards = []
    @spanish_nouns = []
    @spanish_verbs = []
    @spanish_adjectives = []
    quiz_questions.each do |quiz_question|
      question = quiz_question.question
      quiz_question.amount.times do
        check_if_anything_empty
        case question.name
        when 'Hindi - Single Noun'
          @noun = get_noun(quiz_question)
          plural = (rand(2) == 1)
          result << {
            question: get_english_plural(plural, @noun).capitalize,
            answers: all_synonyms([
              (plural ? @noun.transliterated_plural : @noun.transliterated),
              (plural ? @noun.foreign_plural : @noun.foreign)
            ])
          }
        when 'Spanish - Single Noun'
          @spanish_noun = get_spanish_noun(quiz_question)
          synonyms = @spanish_noun.synonyms
          plural = (rand(2) == 1)
          result << {
            question: plural_notification_spanish({ noun: @spanish_noun, use_plural: plural }).capitalize,
            answers: synonyms.map do |spanish_noun|
              (plural ? spanish_noun.spanish_plural : spanish_noun.spanish)
            end
          }
        when 'Hindi - Single Verb'
          verb = get_verb(quiz_question)
          result << {
            question: verb.english.capitalize,
            answers: [
              verb.transliterated_infinitive,
              verb.infinitive
            ]
          }
        when 'Hindi - Single Adjective'
          adjective = @adjectives.pop
          result << {
            question: adjective.english.capitalize,
            answers: [
              adjective.transliterated_masculine,
              adjective.masculine
            ]
          }
        when 'Hindi - Does Subject know that...?'
          english_subject = get_random_single_english_subject
          subject_objects = get_subject_object(english_subject)
          noun = get_noun(quiz_question)
          english_single_plural_same = (noun.english == noun.english_plural)
          adjective = @adjectives.pop
          synonyms = noun.synonyms
          answers = []
          synonyms.each do |synonym|
            subject_objects.each do |subject_object|
              oblique_subject = obliqify_subject(subject_object[:transliterated])
              answers += [
                "kya #{oblique_subject[:transliterated][0]} malum hai ki #{synonym.transliterated_plural} #{synonym.gender.odd? ? (english_single_plural_same ? adjective.transliterated_masculine : adjective.transliterated_masculine_plural) : adjective.transliterated_feminine} #{synonym.gender.odd? ? (english_single_plural_same ? 'hota' : 'hote') : 'hoti'} hai?",
                "क्या #{oblique_subject[:hindi][0]} मालूम है कि #{synonym.foreign_plural} #{synonym.gender.odd? ? (english_single_plural_same ? adjective.masculine : adjective.masculine_plural) : adjective.feminine} #{synonym.gender.odd? ? (english_single_plural_same ? 'होता' : 'होते') : 'होती'} हैं?"
              ]
            end
          end
          result << {
            question: "#{['he', 'she', 'it', 'this', 'that'].include?(english_subject) ? 'Does' : 'Do'} #{english_subject} know that #{noun.english_plural} #{english_single_plural_same ? 'is' : 'are'} #{adjective.english}?",
            answers: answers.uniq
          }
        when 'Hindi - Subject knows that...'
          english_subject = get_random_single_english_subject
          subject_objects = get_subject_object(english_subject)
          noun = get_noun(quiz_question)
          english_single_plural_same = (noun.english == noun.english_plural)
          adjective = @adjectives.pop
          synonyms = noun.synonyms
          answers = []
          synonyms.each do |synonym|
            subject_objects.each do |subject_object|
              oblique_subject = obliqify_subject(subject_object[:transliterated])
              answers += [
                "#{oblique_subject[:transliterated][0]} malum hai ki #{synonym.transliterated_plural} #{synonym.gender.odd? ? (english_single_plural_same ? adjective.transliterated_masculine : adjective.transliterated_masculine_plural) : adjective.transliterated_feminine} #{synonym.gender.odd? ? (english_single_plural_same ? 'hota' : 'hote') : 'hoti'} hai",
                "#{oblique_subject[:hindi][0]} मालूम है कि #{synonym.foreign_plural} #{synonym.gender.odd? ? (english_single_plural_same ? adjective.masculine : adjective.masculine_plural) : adjective.feminine} #{synonym.gender.odd? ? (english_single_plural_same ? 'होता' : 'होते') : 'होती'} हैं"
              ]
            end
          end
          result << {
            question: "#{english_subject.capitalize} know#{['he', 'she', 'it', 'this', 'that'].include?(english_subject) ? 's' : ''} that #{noun.english_plural} #{english_single_plural_same ? 'is' : 'are'} #{adjective.english}.",
            answers: answers.uniq
          }
        when 'Hindi - General Statement'
          noun = get_noun(quiz_question)
          english_single_plural_same = (noun.english == noun.english_plural)
          adjective = @adjectives.pop
          synonyms = noun.synonyms
          answers = []
          synonyms.each do |synonym|
            answers += [
              "#{synonym.transliterated_plural} #{synonym.gender.odd? ? (english_single_plural_same ? adjective.transliterated_masculine : adjective.transliterated_masculine_plural) : adjective.transliterated_feminine} #{synonym.gender.odd? ? (english_single_plural_same ? 'hota' : 'hote') : 'hoti'} hai",
              "#{synonym.foreign_plural} #{synonym.gender.odd? ? (english_single_plural_same ? adjective.masculine : adjective.masculine_plural) : adjective.feminine} #{synonym.gender.odd? ? (english_single_plural_same ? 'होता' : 'होते') : 'होती'} हैं"
            ]
          end
          result << {
            question: "#{noun.english_plural.capitalize} #{english_single_plural_same ? 'is' : 'are'} #{adjective.english}.",
            answers: answers
          }
        when 'Hindi - Where can you get Adjective Nouns?'
          noun = get_noun(quiz_question)
          english_single_plural_same = (noun.english == noun.english_plural)
          adjective = @adjectives.pop
          synonyms = noun.synonyms
          answers = []
          synonyms.each do |synonym|
            answers += [
              "#{synonym.gender.odd? ? (english_single_plural_same ? adjective.transliterated_masculine : adjective.transliterated_masculine_plural) : adjective.transliterated_feminine} #{synonym.transliterated_plural} kaha #{synonym.gender.odd? ? (english_single_plural_same ? 'milta' : 'milte') : 'milti'} hai?",
              "#{synonym.gender.odd? ? (english_single_plural_same ? adjective.masculine : adjective.masculine_plural) : adjective.feminine} #{synonym.foreign_plural} कहाँ #{synonym.gender.odd? ? (english_single_plural_same ? 'मिलता' : 'मिलते') : 'मिलती'} हैं?"
            ]
          end
          result << {
            question: "Where can you get #{adjective.english} #{noun.english_plural}?",
            answers: answers
          }
        when 'Hindi - Availability'
          noun = get_noun(quiz_question)
          english_single_plural_same = (noun.english == noun.english_plural)
          adjective = @adjectives.pop
          synonyms = noun.synonyms
          answers = []
          location = get_location
          synonyms.each do |synonym|
            answers += [
              "#{location[:transliterated]} #{synonym.gender.odd? ? (english_single_plural_same ? adjective.transliterated_masculine : adjective.transliterated_masculine_plural) : adjective.transliterated_feminine} #{synonym.transliterated_plural} #{synonym.gender.odd? ? (english_single_plural_same ? 'milta' : 'milte') : 'milti'} hai",
              "#{location[:hindi]} #{synonym.gender.odd? ? (english_single_plural_same ? adjective.masculine : adjective.masculine_plural) : adjective.feminine} #{synonym.foreign_plural} #{synonym.gender.odd? ? (english_single_plural_same ? 'मिलता' : 'मिलते') : 'मिलती'} हैं"
            ]
          end
          result << {
            question: "#{adjective.english.capitalize} #{noun.english_plural} #{english_single_plural_same ? 'is' : 'are'} available #{location[:english]}.",
            answers: answers
          }
        when 'Hindi - Where is Subject\'s Noun?'
          use_plural = [true, false].sample
          @noun = get_noun(quiz_question)
          english_subject = get_random_possession_english_subject
          possession_objects = get_possession_objects(english_subject)
          result << {
            question: "Where #{use_plural ? 'are' : 'is'} #{english_subject} #{use_plural ? @noun[:english_plural] : @noun[:english]}?",
            answers: all_synonyms(possession_objects.map do |possession_object|
              proper_possession_object = proper_possession({ possession_object: possession_object, noun: @noun, noun_plural: use_plural })
              [
                "#{proper_possession_object[:transliterated]} #{use_plural ? @noun[:transliterated_plural] : @noun[:transliterated]} kaha hai?",
                "#{proper_possession_object[:hindi]} #{use_plural ? @noun[:foreign_plural] : @noun[:foreign]} कहाँ है?"
              ]
            end.flatten.uniq, use_plural)
          }
        when 'Hindi - The Noun is Preposition the Adjective Noun'
          @noun = get_noun(quiz_question)
          use_noun_plural = [true, false].sample
          noun_english, noun_transliterated, noun_hindi = get_proper_words_from_plural({ noun: @noun, plural: use_noun_plural })
          preposition = get_preposition
          @noun2 = get_noun(quiz_question)
          use_noun2_plural = [true, false].sample
          noun2_english, noun2_transliterated, noun2_hindi = get_proper_words_from_plural({ noun: @noun2, plural: use_noun2_plural })
          @adjective = @adjectives.pop
          hindi_answers = [
            "#{noun_hindi} #{obliqify({ adjective_hindi: @adjective, noun_hindi: @noun2 })} #{obliqify({ noun_hindi: @noun2, plural: use_noun2_plural })} #{preposition[:hindi]} है"
          ]
          transliterated_answers = [
            "#{noun_transliterated} #{obliqify({ adjective_transliterated: @adjective, noun_transliterated: @noun2 })} #{obliqify({ noun_transliterated: @noun2, plural: use_noun2_plural })} #{preposition[:transliterated]} hai"
          ]
          result << {
            question: "The #{noun_english} #{use_noun_plural ? 'are' : 'is'} #{preposition[:english]} the #{@adjective.english} #{oblique_plural_notification(use_noun2_plural, noun2_english, @noun2)}.",
            answers: all_synonyms(hindi_answers, use_noun_plural, use_noun2_plural) + all_synonyms(transliterated_answers, use_noun_plural, use_noun2_plural)
          }
        when 'Hindi - There is a Noun Preposition the Adjective Noun'
          @noun = get_noun(quiz_question)
          use_noun_plural = [true, false].sample
          noun_english, noun_transliterated, noun_hindi = get_proper_words_from_plural({ noun: @noun, plural: use_noun_plural })
          preposition = get_preposition
          @noun2 = get_noun(quiz_question)
          use_noun2_plural = [true, false].sample
          noun2_english, noun2_transliterated, noun2_hindi = get_proper_words_from_plural({ noun: @noun2, plural: use_noun2_plural })
          @adjective = @adjectives.pop
          hindi_answers = [
            "#{obliqify({ adjective_hindi: @adjective, noun_hindi: @noun2 })} #{obliqify({ noun_hindi: @noun2, plural: use_noun2_plural })} #{preposition[:hindi]} #{noun_hindi} है"
          ]
          transliterated_answers = [
            "#{obliqify({ adjective_transliterated: @adjective, noun_transliterated: @noun2 })} #{obliqify({ noun_transliterated: @noun2, plural: use_noun2_plural })} #{preposition[:transliterated]} #{noun_transliterated} hai"
          ]
          result << {
            question: "There #{use_noun_plural ? 'are' : "is #{a_or_an(noun_english)}"} #{noun_english} #{preposition[:english]} the #{@adjective.english} #{oblique_plural_notification(use_noun2_plural, noun2_english, @noun2)}.",
            answers: all_synonyms(hindi_answers) + all_synonyms(transliterated_answers)
          }
        when 'Hindi - Subject is a Noun'
          @noun = get_noun(quiz_question)
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
        when 'Hindi - Subject are Nouns'
          @noun = get_noun(quiz_question)
          subject_objects = get_subject_object(get_random_plural_english_subject)
          question_subject_object = subject_objects.sample
          result << {
            question: "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{@noun[:english_plural]}.",
            answers: all_synonyms(subject_objects.map do |hash|
              [
                "#{hash[:transliterated]} #{@noun[:transliterated_plural]} #{hash[:transliterated_be]}",
                "#{hash[:hindi]} #{@noun[:foreign_plural]} #{hash[:hindi_be]}"
              ]
            end.flatten.uniq, true)
          }
        when 'Hindi - Subject is Adjective'
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
        when 'Hindi - Subject is an Adjective Noun'
          @noun = get_noun(quiz_question)
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
        when 'Hindi - Subject are Adjective Nouns'
          @noun = get_noun(quiz_question)
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
            end.flatten.uniq, true)
          }
        when 'Hindi - Subject has a Noun'
          subject_objects = get_subject_object(get_random_english_subject)
          subject_has_objects = get_subject_has_objects(subject_objects)
          @noun = get_noun(quiz_question)
          use_plural = [true, false].sample
          result << {
            question: "#{subject_has_objects.first[:english].capitalize} #{use_plural ? '' : a_or_an(@noun.english)} #{get_english_plural(use_plural, @noun)}.",
            answers: all_synonyms(subject_has_objects.map.with_index do |subject_has_object, index|
              [
                "#{subject_has_object[:transliterated]} #{use_plural ? @noun.transliterated_plural : @noun.transliterated} hai",
                "#{subject_has_object[:transliterated]} #{use_plural ? '' : 'ek '}#{use_plural ? @noun.transliterated_plural : @noun.transliterated} hai",
                "#{subject_has_object[:hindi]} #{use_plural ? @noun.foreign_plural : @noun.foreign} #{use_plural ? 'हैं' : 'है'}",
                "#{subject_has_object[:hindi]} #{use_plural ? '' : 'एक '}#{use_plural ? @noun.foreign_plural : @noun.foreign} #{use_plural ? 'हैं' : 'है'}"
              ]
            end.flatten.uniq, use_plural)
          }
        when 'Hindi - Subject has an Adjective Noun'
          subject_objects = get_subject_object(get_random_english_subject)
          subject_has_objects = get_subject_has_objects(subject_objects)
          @noun = get_noun(quiz_question)
          use_plural = [true, false].sample
          use_plural = true
          adjective = @adjectives.pop
          transliterated_adjectives, hindi_adjectives = proper_adjective_forms({ adjective: adjective, noun: @noun, plural: use_plural })
          result << {
            question: "#{subject_has_objects.first[:english].capitalize} #{use_plural ? '' : a_or_an(adjective.english)} #{adjective.english} #{get_english_plural(use_plural, @noun)}.",
            answers: all_synonyms(subject_has_objects.map.with_index do |subject_has_object, index|
              [
                "#{subject_has_object[:transliterated]} #{transliterated_adjectives.first} #{use_plural ? @noun.transliterated_plural : @noun.transliterated} hai",
                "#{subject_has_object[:transliterated]} #{use_plural ? '' : 'ek '}#{transliterated_adjectives.first} #{use_plural ? @noun.transliterated_plural : @noun.transliterated} hai",
                "#{subject_has_object[:hindi]} #{hindi_adjectives.first} #{use_plural ? @noun.foreign_plural : @noun.foreign} #{use_plural ? 'हैं' : 'है'}",
                "#{subject_has_object[:hindi]} #{use_plural ? '' : 'एक '}#{hindi_adjectives.first} #{use_plural ? @noun.foreign_plural : @noun.foreign} #{use_plural ? 'हैं' : 'है'}"
              ]
            end.flatten.uniq, use_plural)
          }
        when 'Hindi - Noun Gender'
          noun = get_noun(quiz_question)
          result << {
            question: noun.foreign,
            answers: [
              noun.gender == 1 ? 'm' : 'f'
            ]
          }
        when 'Hindi - Noun Plural'
          noun = get_noun(quiz_question)
          result << {
            question: noun[:foreign],
            answers: [
              noun[:transliterated_plural],
              noun[:foreign_plural]
            ]
          }
        when 'Hindi - Noun is Adjective'
          @noun = get_noun(quiz_question)
          adjective = @adjectives.pop
          use_plural = [true, false].sample
          if use_plural
            english_subject = ['the', 'these', 'those'].sample
          else
            english_subject = ['the', 'this', 'that'].sample
          end
          subject_object = english_subject == 'the' ? nil : get_subject_object(english_subject).first
          english_subject = english_subject == 'the' ? 'the' : subject_object[:english]
          transliterated_subject = english_subject == 'the' ? '' : subject_object[:transliterated] + ' '
          hindi_subject = english_subject == 'the' ? '' : subject_object[:hindi] + ' '
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
            ].flatten, use_plural)
          }
        when 'Card'
          if quiz_question.tag_id
            tagged_cards = []
            until !tagged_cards.empty? do
              tagged_cards = @cards.select { |card| card.tags.map(&:id).include?(quiz_question.tag_id) }
              if tagged_cards.empty?
                archived_cards = Card.includes(:tags).where(tags: { name: 'Archived' })
                all_tagged_cards = Card.includes(:tags).where(tags: { id: quiz_question.tag_id })
                if self.use_archived
                  @cards += (all_tagged_cards & archived_cards)
                else
                  @cards += (all_tagged_cards - archived_cards)
                end
              end
            end
            card = tagged_cards.sample
            @cards.reject! { |c| c == card }
          else
            card = @cards.pop
          end
          obj = {
            question: card.question,
            answers: [card.answer],
            textbox: card.answer.include?("\n"),
            imageUrl: card.image_url
          }
          if card.multiple_choice
            other_cards = CardTag.where(tag_id: card.tags.first.id, cardtagable_type: "Card").map(&:cardtagable) - [card]
            obj["choices"] = ([card.answer] + other_cards.take(3).map(&:answer))
          end
          result << obj
        when 'Hindi - Imperfective Present Yes/No Question'
          english_subject = get_random_english_subject
          gender, gender_notification = get_gender_from_subject(english_subject)
          plural = get_plural_from_subject(english_subject)
          subject_objects = get_subject_object(english_subject)
          verb = @verbs.pop
          do_verb = Verb.find_by_english('do')
          result << {
            question: "#{do_verb.english_imperfective(english_subject, plural).capitalize} #{english_subject == 'I' ? 'I' : english_subject.downcase} #{verb.english}?#{gender_notification}",
            answers: subject_objects.map do |subject_object|
              [
                "kya #{subject_object[:transliterated]} #{verb.transliterated_imperfective(gender, plural)} #{subject_object[:transliterated_be]}?",
                "क्या #{subject_object[:hindi]} #{verb.hindi_imperfective(gender, plural)} #{subject_object[:hindi_be]}?"
              ]
            end.flatten.uniq
          }
        when 'Hindi - Imperfective Present Question'
          question_word = get_question_word
          english_subject = get_random_english_subject
          gender, gender_notification = get_gender_from_subject(english_subject)
          plural = get_plural_from_subject(english_subject)
          subject_objects = get_subject_object(english_subject)
          verb = @verbs.pop
          do_verb = Verb.find_by_english('do')
          result << {
            question: "#{question_word[:english].capitalize} #{do_verb.english_imperfective(english_subject, plural)} #{english_subject == 'I' ? 'I' : english_subject.downcase} #{verb.english}?#{gender_notification}",
            answers: subject_objects.map do |subject_object|
              [
                "#{subject_object[:transliterated]} #{question_word[:transliterated]} #{verb.transliterated_imperfective(gender, plural)} #{subject_object[:transliterated_be]}?",
                "#{subject_object[:hindi]} #{question_word[:hindi]} #{verb.hindi_imperfective(gender, plural)} #{subject_object[:hindi_be]}?"
              ]
            end.flatten.uniq
          }
        when 'Hindi - Imperfective Present'
          english_subject = get_random_english_subject
          use_plural = ['you', 'these', 'those', 'they'].include?(english_subject)
          gender, gender_notification = get_gender_from_subject(english_subject)
          subject_objects = get_subject_object(english_subject)
          verb = @verbs.pop
          if verb.english == 'live'
            place_eng, place_trans, place_hindi = get_place
            extra_eng = " in #{place_eng}"
            extra_trans = "#{place_trans} me "
            extra_hindi = "#{place_hindi} में "
          else
            extra_eng, extra_trans, extra_hindi = ''
          end
          use_negative = (rand(3) == 0)
          negative_hindi = use_negative ? 'नहीं ' : ''
          negative_trans = use_negative ? 'nahi ' : ''
          result << {
            question: "#{english_subject.capitalize} #{english_negative_verb(use_negative, english_subject)}#{verb.english_imperfective(english_subject, use_negative)}#{extra_eng}.#{gender_notification}",
            answers: subject_objects.map do |subject_object|
              [
                "#{subject_object[:transliterated]} #{extra_trans}#{negative_trans}#{verb.transliterated_imperfective(gender, use_plural)} #{subject_object[:transliterated_be]}",
                "#{subject_object[:hindi]} #{extra_hindi}#{negative_hindi}#{verb.hindi_imperfective(gender, use_plural)} #{subject_object[:hindi_be]}",
                (use_negative ? "#{subject_object[:transliterated]} #{extra_trans}#{negative_trans}#{verb.transliterated_imperfective(gender, use_plural)}" : nil),
                (use_negative ? "#{subject_object[:hindi]} #{extra_hindi}#{negative_hindi}#{verb.hindi_imperfective(gender, use_plural)}" : nil)
              ].compact
            end.flatten.uniq
          }
        when 'Hindi - Imperative'
          verb = @verbs.pop
          tense = ['familiar', 'informal', 'formal'].sample
          use_adverb = (rand(3) > 0)
          adverb = @adverbs.pop if use_adverb
          adverb_hindi = use_adverb ? "#{adverb.foreign} " : ''
          adverb_transliterated = use_adverb ? "#{adverb.transliterated} " : ''
          adverb_english = use_adverb ? " #{adverb.english}" : ''
          negate = [true, false].sample
          case tense
          when 'familiar'
            hindi_answer = verb.hindi_stem
            transliterated_answer = verb.transliterated_stem
          when 'informal'
            hindi_answer = verb.hindi_informal
            transliterated_answer = verb.transliterated_informal
          when 'formal'
            hindi_answer = verb.hindi_formal
            transliterated_answer = verb.transliterated_formal
          end
          if verb.postposition.present?
            name_eng, name_hindi = get_name
            extra_eng = " #{verb.english_preposition}#{verb.english_preposition.present? ? ' ' : ''}#{name_eng}"
            extra_trans = "#{name_eng} #{verb.postposition_trans} "
            extra_hindi = "#{name_hindi} #{verb.postposition} "
          else
            extra_eng = ''
            extra_trans = ''
            extra_hindi = ''
          end
          hindi_answer = "#{adverb_hindi}#{extra_hindi}#{hindi_answer}"
          transliterated_answer = "#{adverb_transliterated}#{extra_trans}#{transliterated_answer}"
          if negate
            hindi_words = hindi_answer.split(' ')
            hindi_answers = [
              hindi_words.dup.insert(-2, 'मत').join(' '),
              hindi_words.insert(-2, 'ना').join(' ')
            ]
            trans_words = transliterated_answer.split(' ')
            transliterated_answers = [
              trans_words.dup.insert(-2, 'mat').join(' '),
              trans_words.insert(-2, 'na').join(' ')
            ]
          else
            hindi_answers = [hindi_answer]
            transliterated_answers = [transliterated_answer]
          end
          question_text = "#{tense == 'formal' ? 'Please ' : ''}#{negate ? "don't " : ''}#{verb.english}#{tense == 'familiar' ? ' (familiar)' : ''}#{extra_eng}#{adverb_english}."
          result << {
            question: question_text.slice(0, 1).capitalize + question_text.slice(1..-1),
            answers: [
              hindi_answers,
              transliterated_answers
            ].flatten
          }
        when 'Hindi - Subject likes Noun'
          english_subject = get_random_english_subject
          use_plural = ['you', 'these', 'those', 'they', 'we', 'I'].include?(english_subject)
          subject_objects = get_subject_object(english_subject)
          @noun = get_noun(quiz_question)
          synonyms = @noun.synonyms
          answers = []
          synonyms.each do |synonym|
            subject_objects.each do |subject_object|
              oblique_subject = obliqify_subject(subject_object[:transliterated])
              answers << "#{oblique_subject[:transliterated][0]} #{synonym.transliterated_plural} pasand hai"
              answers << "#{oblique_subject[:hindi][0]} #{synonym.foreign_plural} पसंद हैं"
            end
          end
          result << {
            question: "#{english_subject.capitalize} like#{use_plural ? '' : 's'} #{@noun.english_plural}.",
            answers: answers.uniq
          }
        when 'Hindi - Does Subject like Noun?'
          english_subject = get_random_english_subject
          use_plural = ['you', 'these', 'those', 'they', 'we', 'I'].include?(english_subject)
          subject_objects = get_subject_object(english_subject)
          @noun = get_noun(quiz_question)
          synonyms = @noun.synonyms
          answers = []
          synonyms.each do |synonym|
            subject_objects.each do |subject_object|
              oblique_subject = obliqify_subject(subject_object[:transliterated])
              answers << "kya #{oblique_subject[:transliterated][0]} #{synonym.transliterated_plural} pasand hai?"
              answers << "क्या #{oblique_subject[:hindi][0]} #{synonym.foreign_plural} पसंद हैं?"
            end
          end
          result << {
            question: "#{use_plural ? 'Do' : 'Does'} #{english_subject} like #{@noun.english_plural}?",
            answers: answers.uniq
          }
        when 'Hindi - Subject wants a Noun'
          english_subject = get_random_english_subject
          use_want = ['you', 'these', 'those', 'they', 'we', 'I'].include?(english_subject)
          use_plural = [true, false].sample
          subject_objects = get_subject_object(english_subject)
          @noun = get_noun(quiz_question)
          synonyms = @noun.synonyms
          answers = []
          synonyms.each do |synonym|
            subject_objects.each do |subject_object|
              oblique_subject = obliqify_subject(subject_object[:transliterated])
              answers << "#{oblique_subject[:transliterated][0]} #{use_plural ? synonym.transliterated_plural : synonym.transliterated} chahie"
              answers << "#{oblique_subject[:transliterated][0]} ek #{synonym.transliterated} chahie" unless use_plural
              answers << "#{oblique_subject[:hindi][0]} #{use_plural ? synonym.foreign_plural : synonym.foreign} चाहिए"
              answers << "#{oblique_subject[:hindi][0]} एक #{synonym.foreign} चाहिए" unless use_plural
            end
          end
          result << {
            question: "#{english_subject.capitalize} want#{use_want ? '' : 's'} #{use_plural ? '' : a_or_an(@noun.english) + ' '}#{use_plural ? @noun.english_plural : @noun.english}.",
            answers: answers.uniq
          }
        when 'Hindi - Does Subject want a Noun?'
          english_subject = get_random_english_subject
          use_do = ['you', 'these', 'those', 'they', 'we', 'I'].include?(english_subject)
          subject_objects = get_subject_object(english_subject)
          use_plural = [true, false].sample
          @noun = get_noun(quiz_question)
          synonyms = @noun.synonyms
          answers = []
          synonyms.each do |synonym|
            subject_objects.each do |subject_object|
              oblique_subject = obliqify_subject(subject_object[:transliterated])
              answers << "kya #{oblique_subject[:transliterated][0]} #{use_plural ? synonym.transliterated_plural : synonym.transliterated} chahie?"
              answers << "kya #{oblique_subject[:transliterated][0]} ek #{synonym.transliterated} chahie?" unless use_plural
              answers << "क्या #{oblique_subject[:hindi][0]} #{use_plural ? synonym.foreign_plural : synonym.foreign} चाहिए?"
              answers << "क्या #{oblique_subject[:hindi][0]} एक #{synonym.foreign} चाहिए?" unless use_plural
            end
          end
          result << {
            question: "#{use_do ? 'Do' : 'Does'} #{english_subject} want #{use_plural ? '' : a_or_an(@noun.english) + ' '}#{use_plural ? @noun.english_plural : @noun.english}?",
            answers: answers.uniq
          }
        end
      end
    end
    result.shuffle
  end

  private

  def get_question_word
    [
      { english: 'where',
        transliterated: 'kaha',
        hindi: 'कहाँ'
      },
      { english: 'why',
        transliterated: 'kyo',
        hindi: 'क्यों'
      },
      { english: 'when',
        transliterated: 'kab',
        hindi: 'कब'
      }
    ].sample
  end

  def get_preposition
    [
      { english: 'on',
        transliterated: 'par',
        hindi: 'पर'
      },
      { english: 'in',
        transliterated: 'me',
        hindi: 'में'
      },
      { english: 'near',
        transliterated: 'ke pas',
        hindi: 'के पास'
      }
    ].sample
  end

  def get_proper_words_from_plural(args)
    noun = args[:noun]
    if args[:plural]
      [noun.english_plural, noun.transliterated_plural, noun.foreign_plural]
    else
      [noun.english, noun.transliterated, noun.foreign]
    end
  end

  def all_synonyms(answers, use_plural = false, use_plural_2 = false)
    synonyms = @noun.synonyms
    if @noun2
      synonyms2 = @noun2.synonyms
      result = []
      answers.each do |answer|
        synonyms.each do |synonym|
          synonyms2.each do |synonym2|
            if !use_plural && !use_plural_2
              result << answer.gsub(@noun.foreign, synonym.foreign).gsub(@noun.transliterated, synonym.transliterated).gsub(@noun2.foreign, synonym2.foreign).gsub(@noun2.transliterated, synonym2.transliterated)
            elsif use_plural && !use_plural_2
              result << answer.gsub(@noun.foreign_plural, synonym.foreign_plural).gsub(@noun.transliterated_plural, synonym.transliterated_plural).gsub(@noun2.foreign, synonym2.foreign).gsub(@noun2.transliterated, synonym2.transliterated)
            elsif !use_plural && use_plural_2
              result << answer.gsub(@noun.foreign, synonym.foreign).gsub(@noun.transliterated, synonym.transliterated).gsub(@noun2.foreign_plural, synonym2.foreign_plural).gsub(@noun2.transliterated_plural, synonym2.transliterated_plural)
            elsif use_plural && use_plural_2
              result << answer.gsub(@noun.foreign_plural, synonym.foreign_plural).gsub(@noun.transliterated_plural, synonym.transliterated_plural).gsub(@noun2.foreign_plural, synonym2.foreign_plural).gsub(@noun2.transliterated_plural, synonym2.transliterated_plural)
            end
          end
        end
      end
    else
      result = answers.map do |answer|
        synonyms.map do |synonym|
          if use_plural
            answer.gsub(@noun.foreign_plural, synonym.foreign_plural).gsub(@noun.transliterated_plural, synonym.transliterated_plural)
          else
            answer.gsub(@noun.foreign, synonym.foreign).gsub(@noun.transliterated, synonym.transliterated)
          end
        end
      end
    end
    result.flatten.uniq
  end

  def check_if_anything_empty
    @nouns = Noun.all.to_a.shuffle if @nouns.empty?
    @verbs = Verb.all.to_a.shuffle if @verbs.empty?
    @adjectives = Adjective.all.to_a.shuffle if @adjectives.empty?
    @adverbs = Adverb.all.to_a.shuffle if @adverbs.empty?
    @spanish_nouns = SpanishNoun.all.to_a.shuffle if @spanish_nouns.empty?
    if @cards.empty?
      if self.use_archived
        archived_cards = Card.joins(:tags).where(tags: { name: 'Archived' })
        raise 'No Archived Cards' if archived_cards.empty?
        @cards = archived_cards.to_a.shuffle
        puts archived_cards.pluck(:question)
      else
        unarchived_cards = Card.all - Card.joins(:tags).where(tags: { name: 'Archived' })
        raise 'No Unarchived Cards' if unarchived_cards.empty?
        @cards = unarchived_cards.to_a.shuffle
      end
    end
  end

  def get_noun(quiz_question)
    if quiz_question.tag_id
      tagged_nouns = []
      until !tagged_nouns.empty? do
        tagged_nouns = @nouns.select { |noun| noun.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_nouns.empty?
          @nouns += Noun.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
        end
      end
      noun = tagged_nouns.sample
      @nouns.reject! { |n| n == noun }
    else
      noun = @nouns.pop
    end
    noun
  end

  def get_spanish_noun(quiz_question)
    if quiz_question.tag_id
      tagged_nouns = []
      until !tagged_nouns.empty? do
        tagged_nouns = @spanish_nouns.select { |noun| noun.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_nouns.empty?
          @spanish_nouns += SpanishNoun.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
        end
      end
      noun = tagged_nouns.sample
      @spanish_nouns.reject! { |n| n == noun }
    else
      noun = @spanish_nouns.pop
    end
    noun
  end

  def get_verb(quiz_question)
    if quiz_question.tag_id
      tagged_verbs = []
      until !tagged_verbs.empty? do
        tagged_verbs = @verbs.select { |verb| verb.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_verbs.empty?
          @verbs += Verb.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
        end
      end
      verb = tagged_verbs.sample
      @verbs.reject! { |v| v == verb }
    else
      verb = @verbs.pop
    end
    verb
  end

  def obliqify_subject(subject)
    case subject
    when 'mai'
      { hindi: ['मुझको'], transliterated: ['mujhko'] }
    when 'tum'
      { hindi: ['तुझको'], transliterated: ['tumko'] }
    when 'ap'
      { hindi: ['आपको'], transliterated: ['apko'] }
    when 'ham'
      { hindi: ['हमको'], transliterated: ['hamko'] }
    when 'yah'
      { hindi: ['इसको'], transliterated: ['isko'] }
    when 'ye'
      { hindi: ['इनको'], transliterated: ['inko'] }
    when 'vah'
      { hindi: ['उसको'], transliterated: ['usko'] }
    when 've'
      { hindi: ['उनको'], transliterated: ['unko'] }
    end
  end

  def obliqify(args)
    # adjectives with masculine -a endings describing oblique nouns change to -e (even if noun does not end in -a)
    if args[:adjective_transliterated]
      if args[:noun_transliterated].gender == 1 && args[:adjective_transliterated].transliterated_masculine[-1] == 'a'
        "#{args[:adjective_transliterated].transliterated_masculine[0...-1]}e"
      else
        args[:noun_transliterated].gender == 1 ? args[:adjective_transliterated].transliterated_masculine : args[:adjective_transliterated].transliterated_feminine
      end
    elsif args[:adjective_hindi]
      if args[:noun_hindi].gender == 1 && args[:adjective_hindi].masculine[-1] == 'ा'
        "#{args[:adjective_hindi].masculine[0...-1]}े"
      else
        args[:noun_hindi].gender == 1 ? args[:adjective_hindi].masculine : args[:adjective_hindi].feminine
      end
    else
      if args[:plural]
        # nouns ending in -i change to -iyo
        # all other nouns change to -o in the oblique plural
        if args[:noun_transliterated]
          if args[:noun_transliterated].transliterated[-1] == 'i'
            "#{args[:noun_transliterated].transliterated[0...-1]}iyo"
          elsif args[:noun_transliterated].transliterated[-1] == 'o'
            args[:noun_transliterated]
          else
            if args[:noun_transliterated].gender == 1 && args[:noun_transliterated].transliterated[-1] == 'a'
              "#{args[:noun_transliterated].transliterated[0...-1]}o"
            else
              "#{args[:noun_transliterated].transliterated}o"
            end
          end
        elsif args[:noun_hindi]
          if args[:noun_hindi].foreign[-1] == 'ी'
            "#{args[:noun_hindi].foreign[0...-1]}ियों"
          elsif ['ू', 'ो'].include?(args[:noun_hindi].foreign[-1])
            args[:noun_hindi].foreign
          else
            if args[:noun_hindi].foreign[-1] == 'ा'
              if args[:noun_hindi].gender == 1
                "#{args[:noun_hindi].foreign[0...-1]}ों"
              else
                "#{args[:noun_hindi].foreign}ओंं"
              end
            else
              "#{args[:noun_hindi].foreign}ों"
            end
          end
        end
      else
        # singluar nouns with masculine -a endings change to -e
        if args[:noun_transliterated]
          if args[:noun_transliterated].gender == 1 && args[:noun_transliterated].transliterated[-1] == 'a'
            "#{args[:noun_transliterated].transliterated[0...-1]}e"
          else
            args[:noun_transliterated].transliterated
          end
        elsif args[:noun_hindi]
          args[:noun_hindi]
          if args[:noun_hindi].gender == 1 && args[:noun_hindi].foreign[-1] == 'ा'
            "#{args[:noun_hindi].foreign[0...-1]}े"
          else
            args[:noun_hindi].foreign
          end
        end
      end
    end
  end

  def get_random_possession_english_subject
    ['my', 'your', 'our', 'his', 'her', 'its', 'their'][rand(7)]
  end

  def get_random_single_english_subject
    ['I', 'you', 'he', 'she', 'it', 'this', 'that'][rand(7)]
  end

  def get_random_plural_english_subject
    get_random_english_subject(true)
  end

  def get_random_english_subject(plural = false)
    ['we', 'they', 'these', 'those', 'I', 'you', 'he', 'she', 'it', 'this', 'that'][plural ? rand(4) : rand(11)]
  end

  def get_subject_has_objects(subject_objects)
    subject_objects.map do |subject_object|
      case subject_object[:english]
      when 'I'
        {
          english: 'I have',
          transliterated: 'mere pas',
          hindi: 'मेरे पास'
        }
      when 'you'
        {
          english: 'you have',
          transliterated: (subject_object[:hindi] == 'तुम' ? 'tumhare pas' : 'apke pas'),
          hindi: (subject_object[:hindi] == 'तुम' ? 'तुम्हारे पास' : 'आपके पास')
        }
      when 'he', 'she', 'it'
        {
          english: 'he has',
          transliterated: (subject_object[:hindi] == 'यह' ? 'uske pas' : 'iske pas'),
          hindi: (subject_object[:hindi] == 'यह' ? 'उसके पास' : 'इसके पस')
        }
      when 'this'
        {
          english: 'this has',
          transliterated: 'iske pas',
          hindi: 'इसके पास'
        }
      when 'that'
        {
          english: 'that has',
          transliterated: 'uske pas',
          hindi: 'उसके पास'
        }
      when 'we'
        {
          english: 'we have',
          transliterated: 'hamare pas',
          hindi: 'हमारे पास'
        }
      when 'they'
        {
          english: 'they have',
          transliterated: (subject_object[:hindi] == 'ये' ? 'inke pas' : 'unke pas'),
          hindi: (subject_object[:hindi] == 'ये' ? 'इनके पास' : 'उनके पास')
        }
      when 'these'
        {
          english: 'these have',
          transliterated: 'inke pas',
          hindi: 'इनके पास'
        }
      when 'those'
        {
          english: 'those have',
          transliterated: 'unke pas',
          hindi: 'उनके पास'
        }
      end
    end
  end

  def a_or_an(input)
    input.starts_with?('a', 'e', 'i', 'o', 'u') ? 'an' : 'a'
  end

  def proper_possession(args)
    case args[:noun][:gender]
    when 1
      {
        hindi: (args[:noun_plural] ? args[:possession_object][:hindi_masculine_plural] : args[:possession_object][:hindi_masculine_singular]),
        transliterated: (args[:noun_plural] ? args[:possession_object][:transliterated_masculine_plural] : args[:possession_object][:transliterated_masculine_singular])
      }
    when 2
      {
        hindi: args[:possession_object][:hindi_feminine],
        transliterated: args[:possession_object][:transliterated_feminine]
      }
    end
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
    elsif args[:noun]
      raise 'plural argument missing' unless (args[:plural] || args[:plural] == false)
      if args[:noun].gender == 1 && args[:plural] == false
        result = [[args[:adjective].transliterated_masculine], [args[:adjective].masculine]]
      elsif args[:noun].gender == 1 && args[:plural]
        result = [[args[:adjective].transliterated_masculine_plural], [args[:adjective].masculine_plural]]
      elsif args[:noun].gender == 2
        result = [[args[:adjective].transliterated_feminine], [args[:adjective].feminine]]
      end
    end
    result
  end

  def get_possession_objects(english_subject)
    case english_subject
    when 'my'
      [{
        hindi_masculine_singular: 'मेरा',
        hindi_masculine_plural: 'मेरे',
        hindi_feminine: 'मेरी',
        transliterated_masculine_singular: 'mera',
        transliterated_masculine_plural: 'mere',
        transliterated_feminine: 'meri'
      }]
    when 'your'
      [
        {
          hindi_masculine_singular: 'तुम्हारा',
          hindi_masculine_plural: 'तुम्हारे',
          hindi_feminine: 'तुम्हारी',
          transliterated_masculine_singular: 'tumhara',
          transliterated_masculine_plural: 'tumhare',
          transliterated_feminine: 'tumhari'
        },
        {
          hindi_masculine_singular: 'आपका',
          hindi_masculine_plural: 'आपके',
          hindi_feminine: 'आपकी',
          transliterated_masculine_singular: 'apka',
          transliterated_masculine_plural: 'apke',
          transliterated_feminine: 'apki'
        }
      ]
    when 'our'
      [{
        hindi_masculine_singular: 'हमारा',
        hindi_masculine_plural: 'हमारे',
        hindi_feminine: 'हमारी',
        transliterated_masculine_singular: 'hamara',
        transliterated_masculine_plural: 'hamare',
        transliterated_feminine: 'hamari'
      }]
    when 'his', 'her', 'its'
      [
        {
          hindi_masculine_singular: 'इसका',
          hindi_masculine_plural: 'इसके',
          hindi_feminine: 'इसकी',
          transliterated_masculine_singular: 'iska',
          transliterated_masculine_plural: 'iske',
          transliterated_feminine: 'iski'
        },
        {
          hindi_masculine_singular: 'उसका',
          hindi_masculine_plural: 'उसके',
          hindi_feminine: 'उसकी',
          transliterated_masculine_singular: 'uska',
          transliterated_masculine_plural: 'uske',
          transliterated_feminine: 'uski'
        }
      ]
    when 'their'
      [
        {
          hindi_masculine_singular: 'इनका',
          hindi_masculine_plural: 'इनके',
          hindi_feminine: 'इनकी',
          transliterated_masculine_singular: 'inka',
          transliterated_masculine_plural: 'inke',
          transliterated_feminine: 'inki'
        },
        {
          hindi_masculine_singular: 'उसका',
          hindi_masculine_plural: 'उसके',
          hindi_feminine: 'उसकी',
          transliterated_masculine_singular: 'uska',
          transliterated_masculine_plural: 'uske',
          transliterated_feminine: 'uski'
        },
        {
          hindi_masculine_singular: 'उनका',
          hindi_masculine_plural: 'उनके',
          hindi_feminine: 'उनकी',
          transliterated_masculine_singular: 'unka',
          transliterated_masculine_plural: 'unke',
          transliterated_feminine: 'unki'
        }
      ]
    end
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
    when 'you'
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
    when 'he', 'she', 'it'
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
    when 'we'
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
    when 'this'
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
    when 'that'
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
    when 'they'
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
    when 'these'
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
    when 'those'
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

  def get_name
    [
      ['Ram', 'राम'],
      ['Manoj', 'मनोज']
    ].sample
  end

  def get_place
    [
      ['New York', 'New York', 'न्यू यॉर्क'],
      ['Delhi', 'dilli', 'दिल्ली']
    ].sample
  end

  def get_english_plural(use_plural, noun)
    english_single_plural_same = (noun.english == noun.english_plural)
    hindi_single_plural_same = (noun.foreign == noun.foreign_plural)
    if use_plural && english_single_plural_same && !hindi_single_plural_same
      "#{noun[:english_plural]} (plural)"
    elsif use_plural
      noun[:english_plural]
    else
      noun[:english]
    end
  end

  def oblique_plural_notification(use_plural, input, noun)
    english_single_plural_same = (noun.english == noun.english_plural)
    if use_plural && english_single_plural_same
      "#{input} (plural)"
    else
      input
    end
  end

  def english_negative_verb(use_negative, subject)
    return '' unless use_negative
    if ['I', 'you', 'they', 'we', 'these', 'those', 'they'].include?(subject)
      "don't "
    else
      "doesn't "
    end
  end

  def get_plural_from_subject(subject)
    ['we', 'they', 'these', 'those'].include?(subject)
  end

  def get_gender_from_subject(subject)
    if ['I', 'he'].include?(subject)
      gender = 'M'
    elsif ['she'].include?(subject)
      gender = 'F'
    else
      gender = ['M', 'F'].sample
    end
    gender_notification = ['I', 'he', 'she'].include?(subject) ? '' : " (#{gender})"
    [gender, gender_notification]
  end

  def get_location
    [
      {
        english: 'in this shop',
        transliterated: 'is dukan me',
        hindi: 'इस दुकान में'
      },
      {
        english: 'in that shop',
        transliterated: 'us dukan me',
        hindi: 'उस दुकान में'
      },
      {
        english: 'in Delhi',
        transliterated: 'dilli me',
        hindi: 'दिल्ली में'
      }
    ].sample
  end

  # SPANISH HELPER METHODS

  def plural_notification_spanish(args)
    english_single_plural_same = (args[:noun].english == args[:noun].english_plural)
    if args[:use_plural]
      if english_single_plural_same
        "#{args[:noun].english_plural} (plural)"
      else
        "#{args[:noun].english_plural}"
      end
    else
      args[:noun].english
    end
  end

end
