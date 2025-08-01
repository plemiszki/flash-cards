class Quiz < ActiveRecord::Base

  include AvailableQuestions

  validates :name, presence: true
  validates_numericality_of :max_questions, greater_than_or_equal_to: 0, only_integer: true

  has_many :quiz_questions, -> { order(:position) }
  has_many :questions, through: :quiz_questions

  class NoVerbFormError < RuntimeError; end
  class UncountableNounError < RuntimeError; end

  def run
    result = []
    current_chain = []

    @nouns = []
    @verbs = []
    @adjectives = []
    @adverbs = []
    @spanish_nouns = []
    @spanish_verbs = []
    @spanish_adjectives = []
    @spanish_miscs = []
    @spanish_months = []
    @french_nouns = []
    @french_verbs = []
    @french_adjectives = []
    @french_miscs = []
    @french_cities = []
    @french_countries = []
    @cards = get_cards(quiz_questions.select { |qq| qq.question.name == 'Card' })
    @other_answers_cache = Hash.new { |h, k| h[k] = [] }

    my_quiz_questions = quiz_questions
    my_quiz_questions = get_available_questions(quiz_questions: my_quiz_questions, quiz: self)
    my_quiz_questions = get_chained_amounts(quiz_questions: my_quiz_questions)

    my_quiz_questions.each do |quiz_question|
      quiz_question.get_quiz_run_amount.times do
        begin
          obj = generate_question_data(quiz_question)
        rescue NoVerbFormError
          next
        end
        children = quiz_question.children
        if children.empty?
          result << obj
        else
          current_chain = [obj]
          quiz_question.children.each do |quiz_question|
            begin
              current_chain << generate_question_data(quiz_question)
            rescue NoVerbFormError
              next
            rescue UncountableNounError
              next
            end
          end
          result << current_chain
        end
        current_chain = []
      end
    end

    flattened_result = result.shuffle.flatten.map!.with_index do |question, index|
      question[:id] = index
      question
    end

    if max_questions > 0 && flattened_result.length > max_questions
      flattened_result = flattened_result[0...max_questions]
    end
    flattened_result
  end

  def generate_question_data(quiz_question)
    question = quiz_question.question
    check_if_anything_empty
    case question.name
    when 'Card'
      card = @cards.pop
      obj = {
        entityName: 'card',
        question: card.question,
        hint: card.hint,
        answers: (card.match_bins.present? ? [card.match_answer] : [card.answer]),
        answer_placeholder: card.answer_placeholder,
        textbox: card.answer.include?("\n"),
        imageUrl: card.cloudinary_url,
        matchBins: card.match_bins_and_items,
        matchBinsShuffled: card.match_bins_and_items_shuffled,
        unarchiveButton: true,
        cardId: card.id,
        streak: card.streak,
        streakFreezeExpiration: card.streak_freeze_expiration.to_i,
        lastStreakAdd: card.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        tags: card.card_tags.includes(:tag).map { |card_tag| { name: card_tag.tag.name, id: card_tag.id } },
        lineCount: card.config.dig("options", "line_count"),
        inconsolata: card.config.dig("options", "inconsolata"),
        noRepeat: card.config.dig("options", "no_repeat"),
        screamingSnake: card.config.dig("options", "screaming_snake"),
        editLink: "/cards/#{card.id}",
        editLinkText: "Edit Card",
      }
      if card.multiple_choice
        tag_id = card.tags.first.id
        unless @other_answers_cache[tag_id].present?
          @other_answers_cache[tag_id] = CardTag.includes(:cardtagable).where(tag_id: tag_id, cardtagable_type: "Card").map(&:cardtagable).pluck(:answer)
        end
        other_answers = (@other_answers_cache[tag_id].shuffle - [card.answer]).take(7)
        obj["choices"] = ([card.answer] + other_answers)
      end
    when 'French - Noun Singular'
      @noun = French::get_noun(quiz_question, @french_nouns) unless quiz_question.chained
      obj = {
        wordId: @noun.id,
        entityName: 'frenchNoun',
        streak: @noun.streak,
        streakFreezeExpiration: @noun.streak_freeze_expiration.to_i,
        lastStreakAdd: @noun.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: @noun.english.capitalize,
        answers: [
          @noun.french,
        ],
        indeterminate: @noun.just_synonyms.map do |noun|
          noun.french
        end,
        description: 'noun singular',
        highlightButton: true,
        tags: @noun.tags.pluck(:name),
        note: @noun.note,
        editLink: "/french_nouns/#{@noun.id}",
        editLinkText: "Edit Noun",
        highlightText: @noun.french,
        linkUrl: @noun.url,
      }
    when 'French - Noun Plural'
      @noun = French::get_noun(quiz_question, @french_nouns) unless quiz_question.chained
      raise UncountableNounError if @noun.uncountable
      obj = {
        wordId: @noun.id,
        entityName: 'frenchNoun',
        streak: @noun.streak,
        streakFreezeExpiration: @noun.streak_freeze_expiration.to_i,
        lastStreakAdd: @noun.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: @noun.english_plural.capitalize,
        answers: [
          @noun.french_plural,
        ],
        indeterminate: @noun.just_synonyms.map do |noun|
          noun.french_plural
        end,
        description: 'noun plural',
        highlightButton: true,
        tags: @noun.tags.pluck(:name),
        note: @noun.note,
        editLink: "/french_nouns/#{@noun.id}",
        editLinkText: "Edit Noun",
        highlightText: @noun.french,
        linkUrl: @noun.url,
      }
    when 'French - Noun Gender'
      @noun = French::get_noun(quiz_question, @french_nouns) unless quiz_question.chained
      obj = {
        wordId: @noun.id,
        entityName: 'frenchNoun',
        streak: @noun.streak,
        streakFreezeExpiration: @noun.streak_freeze_expiration.to_i,
        lastStreakAdd: @noun.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: @noun.english.capitalize,
        answers: [
          @noun.male? ? 'm' : 'f',
        ],
        validIf: '^(m|f)$',
        description: 'noun gender',
        highlightButton: true,
        tags: @noun.tags.pluck(:name),
        note: @noun.note,
        editLink: "/french_nouns/#{@noun.id}",
        editLinkText: "Edit Noun",
        highlightText: @noun.french,
        linkUrl: @noun.url,
      }
    when 'French - Single Verb - Infinitive'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: @verb.english.capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          verb.french
        end,
        answers: [
          @verb.french
        ],
        description: 'verb',
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        linkUrl: @verb.url,
      }
    when 'French - Single Verb - Present Tense - First Person Singular'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["present"]["je"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "I am #{@verb.english_present_continuous}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          synonym_verb_form = verb.forms["present"]["je"]
          French.vowel_sound?(synonym_verb_form[0]) ? "J'#{synonym_verb_form}." : "Je #{synonym_verb_form}."
        end,
        answers: [
          French.vowel_sound?(verb_form[0]) ? "J'#{verb_form}." : "Je #{verb_form}.",
        ],
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Je ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Present Tense - Second Person Singular (Informal)'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["present"]["tu"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "You are #{@verb.english_present_continuous}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Tu #{verb.forms["present"]["tu"]}."
        end,
        answers: [
          "Tu #{verb_form}.",
        ],
        description: 'informal',
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Tu ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Present Tense - Second Person Singular (Formal)'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["present"]["vous"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "You are #{@verb.english_present_continuous}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Vous #{verb.forms["present"]["vous"]}."
        end,
        answers: [
          "Vous #{verb_form}.",
        ],
        description: 'formal',
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Vous ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Present Tense - First Person Plural'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["present"]["nous"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "We are #{@verb.english_present_continuous}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Nous #{verb.forms["present"]["nous"]}."
        end,
        answers: [
          "Nous #{verb_form}.",
        ],
        description: nil,
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Nous ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Present Tense - Third Person Singular'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["present"]["il"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "He is #{@verb.english_present_continuous}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Il #{verb.forms["present"]["il"]}."
        end,
        answers: [
          "Il #{verb_form}.",
        ],
        description: nil,
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Il ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Present Tense - Third Person Plural'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["present"]["ils"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "They are #{@verb.english_present_continuous}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Ils #{verb.forms["present"]["ils"]}."
        end,
        answers: [
          "Ils #{verb_form}.",
        ],
        description: nil,
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Ils ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Imperative Tense - Second Person Singular (Informal)'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      raise NoVerbFormError if @verb.forms["imperative"].nil? || @verb.forms["imperative"]["tu"].nil?
      verb_form = @verb.forms["imperative"]["tu"]
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "#{@verb.english}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "#{verb.forms["imperative"]["tu"]}.".capitalize
        end,
        answers: [
          "#{verb_form}.".capitalize,
        ],
        description: 'informal',
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Imperative Tense - Second Person Singular (Formal)'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      raise NoVerbFormError if @verb.forms["imperative"].nil? || @verb.forms["imperative"]["vous"].nil?
      verb_form = @verb.forms["imperative"]["vous"]
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "#{@verb.english}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "#{verb.forms["imperative"]["vous"]}.".capitalize
        end,
        answers: [
          "#{verb_form}.".capitalize,
        ],
        description: 'formal',
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Imperative Tense - First Person Plural'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      raise NoVerbFormError if @verb.forms["imperative"].nil? || @verb.forms["imperative"]["nous"].nil?
      verb_form = @verb.forms["imperative"]["nous"]
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "Let's #{@verb.english}.",
        indeterminate: @verb.just_synonyms.map do |verb|
          "#{verb.forms["imperative"]["nous"]}.".capitalize
        end,
        answers: [
          "#{verb_form}.".capitalize,
        ],
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Future Tense - First Person Singular'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["future"]["je"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "I will #{@verb.english}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          synonym_verb_form = verb.forms["future"]["je"]
          French.vowel_sound?(synonym_verb_form[0]) ? "J'#{synonym_verb_form}." : "Je #{synonym_verb_form}."
        end,
        answers: [
          French.vowel_sound?(verb_form[0]) ? "J'#{verb_form}." : "Je #{verb_form}.",
        ],
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Je ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Future Tense - Second Person Singular (Informal)'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["future"]["tu"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "You will #{@verb.english}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Tu #{verb.forms["future"]["tu"]}."
        end,
        answers: [
          "Tu #{verb_form}.",
        ],
        description: 'informal',
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Tu ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Future Tense - Third Person Singular'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["future"]["il"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "You will #{@verb.english}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Il #{verb.forms["future"]["il"]}."
        end,
        answers: [
          "Il #{verb_form}.",
        ],
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Il ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Future Tense - First Person Plural'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["future"]["nous"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "You will #{@verb.english}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Nous #{verb.forms["future"]["nous"]}."
        end,
        answers: [
          "Nous #{verb_form}.",
        ],
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Nous ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Future Tense - Second Person Singular (Formal)'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["future"]["vous"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "You will #{@verb.english}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Vous #{verb.forms["future"]["vous"]}."
        end,
        answers: [
          "Vous #{verb_form}.",
        ],
        description: 'formal',
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Vous ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Future Tense - Third Person Plural'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      synonyms = @verb.synonyms
      verb_form = @verb.forms["future"]["ils"]
      raise NoVerbFormError unless verb_form.present?
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "You will #{@verb.english}.".capitalize,
        indeterminate: @verb.just_synonyms.map do |verb|
          "Ils #{verb.forms["future"]["ils"]}."
        end,
        answers: [
          "Ils #{verb_form}.",
        ],
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "Ils ",
        linkUrl: @verb.url,
        validIf: '.*\.$',
      }
    when 'French - Single Verb - Past Participle'
      @verb = French::get_verb(quiz_question, @french_verbs) unless quiz_question.chained
      past_participle = @verb.forms["past_perfect"]["participle"]
      obj = {
        wordId: @verb.id,
        entityName: 'frenchVerb',
        streak: @verb.streak,
        streakFreezeExpiration: @verb.streak_freeze_expiration.to_i,
        lastStreakAdd: @verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: "(Past participle)",
        answers: [
          past_participle,
        ],
        description: nil,
        highlightButton: true,
        tags: @verb.tags.pluck(:name),
        note: @verb.note,
        editLink: "/french_verbs/#{@verb.id}",
        editLinkText: "Edit Verb",
        highlightText: @verb.french,
        answerPlaceholder: "",
        linkUrl: @verb.url,
      }
    when 'French - Adjective Masculine Singular'
      @adjective = French::get_adjective(quiz_question, @french_adjectives) unless quiz_question.chained
      synonyms = @adjective.synonyms
      obj = {
        wordId: @adjective.id,
        entityName: 'frenchAdjective',
        streak: @adjective.streak,
        streakFreezeExpiration: @adjective.streak_freeze_expiration.to_i,
        lastStreakAdd: @adjective.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: @adjective.english.capitalize,
        answers: [
          @adjective.masculine,
        ],
        indeterminate: @adjective.just_synonyms.map do |adjective|
          [ adjective.masculine ]
        end.flatten,
        description: 'adjective masculine singular',
        highlightButton: true,
        tags: @adjective.tags.pluck(:name),
        editLink: "/french_adjectives/#{@adjective.id}",
        editLinkText: "Edit Adjective",
        highlightText: @adjective.masculine,
        linkUrl: @adjective.url,
        note: @adjective.note,
      }
    when 'French - Adjective Feminine Singular'
      @adjective = French::get_adjective(quiz_question, @french_adjectives) unless quiz_question.chained
      synonyms = @adjective.synonyms
      obj = {
        wordId: @adjective.id,
        entityName: 'frenchAdjective',
        streak: @adjective.streak,
        streakFreezeExpiration: @adjective.streak_freeze_expiration.to_i,
        lastStreakAdd: @adjective.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: @adjective.english.capitalize,
        answers: [
          @adjective.feminine,
        ],
        indeterminate: @adjective.just_synonyms.map do |adjective|
          [ adjective.feminine ]
        end.flatten,
        description: 'adjective feminine singular',
        highlightButton: true,
        tags: @adjective.tags.pluck(:name),
        editLink: "/french_adjectives/#{@adjective.id}",
        editLinkText: "Edit Adjective",
        highlightText: @adjective.masculine,
        linkUrl: @adjective.url,
        note: @adjective.note,
      }
    when 'French - Adjective Masculine Plural'
      @adjective = French::get_adjective(quiz_question, @french_adjectives) unless quiz_question.chained
      synonyms = @adjective.synonyms
      obj = {
        wordId: @adjective.id,
        entityName: 'frenchAdjective',
        streak: @adjective.streak,
        streakFreezeExpiration: @adjective.streak_freeze_expiration.to_i,
        lastStreakAdd: @adjective.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: @adjective.english.capitalize,
        answers: [
          @adjective.masculine_plural,
        ],
        indeterminate: @adjective.just_synonyms.map do |adjective|
          [ adjective.masculine_plural ]
        end.flatten,
        description: 'adjective masculine plural',
        highlightButton: true,
        tags: @adjective.tags.pluck(:name),
        editLink: "/french_adjectives/#{@adjective.id}",
        editLinkText: "Edit Adjective",
        highlightText: @adjective.masculine,
        linkUrl: @adjective.url,
        note: @adjective.note,
      }
    when 'French - Adjective Feminine Plural'
      @adjective = French::get_adjective(quiz_question, @french_adjectives) unless quiz_question.chained
      synonyms = @adjective.synonyms
      obj = {
        wordId: @adjective.id,
        entityName: 'frenchAdjective',
        streak: @adjective.streak,
        streakFreezeExpiration: @adjective.streak_freeze_expiration.to_i,
        lastStreakAdd: @adjective.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: @adjective.english.capitalize,
        answers: [
          @adjective.feminine_plural,
        ],
        indeterminate: @adjective.just_synonyms.map do |adjective|
          [ adjective.feminine_plural ]
        end.flatten,
        description: 'adjective feminine plural',
        highlightButton: true,
        tags: @adjective.tags.pluck(:name),
        editLink: "/french_adjectives/#{@adjective.id}",
        editLinkText: "Edit Adjective",
        highlightText: @adjective.masculine,
        linkUrl: @adjective.url,
        note: @adjective.note,
      }
    when 'French - Single Noun with Article, Singular or Plural'
      noun = French::get_noun(quiz_question, @french_nouns)
      synonyms = noun.synonyms
      plural = (rand(2) == 1)
      obj = {
        wordId: noun.id,
        entityName: 'frenchNoun',
        streak: noun.streak,
        streakFreezeExpiration: noun.streak_freeze_expiration.to_i,
        lastStreakAdd: noun.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: French::display_plural_with_notification({ noun: noun, use_plural: plural }).capitalize,
        answers: [
          plural ? "les #{noun.french_plural}" : "#{noun.definite_article}#{noun.french}"
        ],
        indeterminate: noun.just_synonyms.map do |noun|
          plural ? "les #{noun.french_plural}" : "#{noun.definite_article}#{noun.french}"
        end,
        description: 'noun',
        highlightButton: true,
        tags: noun.tags.pluck(:name),
        note: noun.note,
        editLink: "/french_nouns/#{noun.id}",
        editLinkText: "Edit Noun",
        highlightText: @adjective.masculine,
        linkUrl: @adjective.url,
      }
    when 'French - Single Adjective, Any Agreement'
      adjective = French::get_adjective(quiz_question, @french_adjectives)
      synonyms = adjective.synonyms
      obj = {
        wordId: adjective.id,
        entityName: 'frenchAdjective',
        streak: adjective.streak,
        streakFreezeExpiration: adjective.streak_freeze_expiration.to_i,
        lastStreakAdd: adjective.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: adjective.english.capitalize,
        answers: [
          adjective.masculine,
          adjective.feminine
        ],
        indeterminate: adjective.just_synonyms.map do |adjective|
          [ adjective.masculine, adjective.feminine ]
        end.flatten,
        description: 'adjective',
        highlightButton: true,
        tags: adjective.tags.pluck(:name),
        editLink: "/french_adjectives/#{adjective.id}",
        editLinkText: "Edit Adjective",
        highlightText: @adjective.masculine,
        linkUrl: @adjective.url,
      }
    when 'French - Misc Word'
      word = French::get_misc_word(quiz_question, @french_miscs)
      synonyms = word.synonyms
      obj = {
        wordId: word.id,
        entityName: 'frenchMisc',
        streak: word.streak,
        streakFreezeExpiration: word.streak_freeze_expiration.to_i,
        lastStreakAdd: word.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: word.english.capitalize,
        indeterminate: word.just_synonyms.map do |synonym|
          synonym.french
        end,
        answers: [ word.french ],
        highlightButton: true,
        tags: word.tags.pluck(:name),
        editLink: "/french_miscs/#{word.id}",
        editLinkText: "Edit Word",
        highlightText: word.french,
        linkUrl: word.url,
        description: word.note,
      }
    when 'French - City'
      word = French::get_city(quiz_question, @french_cities)
      obj = {
        wordId: word.id,
        entityName: 'frenchCity',
        streak: word.streak,
        streakFreezeExpiration: word.streak_freeze_expiration.to_i,
        question: word.english.capitalize,
        answers: [ word.french ],
        highlightButton: true,
        tags: word.tags.pluck(:name),
        editLink: "/french_cities/#{word.id}",
        editLinkText: "Edit Word",
        highlightText: word.french.capitalize,
        linkUrl: word.url,
      }
    when 'French - Country'
      @country = French::get_country(quiz_question, @french_countries)
      obj = {
        wordId: @country.id,
        entityName: 'frenchCountry',
        streak: @country.streak,
        streakFreezeExpiration: @country.streak_freeze_expiration.to_i,
        question: @country.english.capitalize,
        answers: [ @country.french ],
        highlightButton: true,
        tags: @country.tags.pluck(:name),
        editLink: "/french_countries/#{@country.id}",
        editLinkText: "Edit Word",
        highlightText: @country.french.capitalize,
        linkUrl: @country.url,
      }
    when 'French - Country Gender'
      @country = French::get_country(quiz_question, @french_countries) unless quiz_question.chained
      obj = {
        wordId: @country.id,
        entityName: 'frenchCountry',
        streak: @country.streak,
        streakFreezeExpiration: @country.streak_freeze_expiration.to_i,
        question: @country.english.capitalize,
        answers: [
          @country.male? ? 'm' : 'f',
        ],
        indeterminate: [],
        description: 'country gender',
        highlightButton: true,
        tags: @country.tags.pluck(:name),
        editLink: "/french_countries/#{@country.id}",
        editLinkText: "Edit Word",
        highlightText: @country.french.capitalize,
        linkUrl: @country.url,
      }
    when 'Hindi - Subject can Verb'
      english_subject = English::get_random_english_subject
      gender, use_plural, notification = English::get_gender_and_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural)
      question_subject_object = subject_objects.first
      verb = get_verb(quiz_question)
      phrase_as_question = random_boolean
      answers = []
      subject_objects.each do |subject_object|
        if phrase_as_question
          answers << "kya #{subject_object[:transliterated]} #{verb.transliterated_stem} #{Hindi::conjugate_sakna({ output: 'transliterated', gender: gender, use_plural: use_plural })} #{subject_object[:transliterated_be]}?"
          answers << "क्या #{subject_object[:hindi]} #{verb.hindi_stem} #{Hindi::conjugate_sakna({ output: 'hindi', gender: gender, use_plural: use_plural })} #{subject_object[:hindi_be]}?"
        else
          answers << "#{subject_object[:transliterated]} #{verb.transliterated_stem} #{Hindi::conjugate_sakna({ output: 'transliterated', gender: gender, use_plural: use_plural })} #{subject_object[:transliterated_be]}"
          answers << "#{subject_object[:hindi]} #{verb.hindi_stem} #{Hindi::conjugate_sakna({ output: 'hindi', gender: gender, use_plural: use_plural })} #{subject_object[:hindi_be]}"
        end
      end
      obj = {
        question: "#{phrase_as_question ? "Can " : ""}#{phrase_as_question ? question_subject_object[:english] : question_subject_object[:english].capitalize}#{phrase_as_question ? "" : " can"}  #{verb.english}#{phrase_as_question ? "?" : "."}#{notification}",
        answers: answers
      }
    when 'Hindi - Let Subject Verb'
      english_subject = English::get_random_english_subject
      gender, use_plural, notification = English::get_gender_and_plural_from_subject(english_subject)
      english_object = English::convert_subject_to_object(english_subject)
      english_object = 'yourself' if english_object == 'you'
      use_formal = random_boolean
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural)
      transliterated_let = use_formal ? "dijie" : "do"
      hindi_let = use_formal ? "दीजिए" : "दो"
      verb = get_verb(quiz_question)
      answers = []
      subject_objects.each do |subject_object|
        oblique_subject = Hindi::obliqify_subject(subject_object[:transliterated])
        answers << "#{oblique_subject[:transliterated]} #{verb.transliterated_oblique} #{transliterated_let}"
        answers << "#{oblique_subject[:hindi]} #{verb.hindi_oblique} #{hindi_let}"
      end
      obj = {
        question: "#{use_formal ? 'Please let' : 'Let'} #{english_object.downcase}#{notification} #{verb.english}.",
        answers: answers
      }
    when 'Hindi - Subject lets Subject Verb'
      english_subject_1 = English::get_random_english_subject
      gender, use_plural, subject_notification = English::get_gender_and_plural_from_subject(english_subject_1)
      subject_objects_1 = Hindi::get_subject_objects(english_subject: english_subject_1, use_plural: use_plural)
      english_subject_2 = English::get_random_english_subject
      gender_2, use_plural_2, object_notification = English::get_gender_and_plural_from_subject(english_subject_2)
      subject_objects_2 = Hindi::get_subject_objects(english_subject: english_subject_2, use_plural: use_plural_2)
      english_object = English::convert_subject_to_object(english_subject_2)
      give_verb = Verb.find_by_english('give')
      verb = get_verb(quiz_question)
      answers = []
      subject_objects_1.each do |subject_object_1|
        subject_objects_2.each do |subject_object_2|
          oblique_subject_2 = Hindi::obliqify_subject(subject_object_2[:transliterated])
          answers << "#{subject_object_1[:transliterated]} #{oblique_subject_2[:transliterated]} #{verb.transliterated_oblique} #{give_verb.transliterated_imperfective({ gender: gender, plural: use_plural })} #{subject_object_1[:transliterated_be]}"
          answers << "#{subject_object_1[:hindi]} #{oblique_subject_2[:hindi]} #{verb.hindi_oblique} #{hindi_let} #{give_verb.hindi_imperfective({ gender: gender, plural: use_plural })} #{subject_object_1[:hindi_be]}"
        end
      end
      let_or_lets = english_subject_1.downcase.in?(['i', 'you', 'we', 'they', 'these', 'those']) ? 'let' : 'lets'
      obj = {
        question: "#{english_subject_1.capitalize}#{subject_notification} #{let_or_lets} #{english_object.downcase}#{object_notification} #{verb.english}.",
        answers: answers
      }
    when 'Hindi - Age'
      n = rand(10) + 1
      english_subject = English::get_random_english_subject
      gender, use_plural, notification = English::get_gender_and_plural_from_subject(english_subject)
      answers = []
      case ['Subject is N years old', 'How old is Subject?', 'How old is that person?'].sample
      when 'Subject is N years old'
        subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural)
        question_subject_object = subject_objects.first
        q = "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{n} year#{n == 1 ? '' : 's'} old.#{notification}"
        subject_objects.each do |subject_object|
          answers += [
            "#{subject_object[:transliterated]} #{Hindi::convert_number(n)[:transliterated]} sal #{Hindi::conjugate_ka({ output: 'transliterated', use_plural: use_plural, gender: gender })} #{subject_object[:transliterated_be]}",
            "#{subject_object[:hindi]} #{Hindi::convert_number(n)[:hindi]} साल #{Hindi::conjugate_ka({ output: 'hindi', use_plural: use_plural, gender: gender })} #{subject_object[:hindi_be]}"
          ]
        end
      when 'How old is Subject?'
        subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural)
        question_subject_object = subject_objects.first
        q = "How old #{question_subject_object[:english_be]} #{question_subject_object[:english]}?#{notification}"
        possession_objects = Hindi::get_possession_objects(english_subject, use_plural)
        possession_objects.each do |possession_object|
          answers << "#{possession_object[:transliterated_feminine]} kitni umra hai?"
          answers << "#{possession_object[:hindi_feminine]} कितनी उम्र​ #{use_plural ? 'हैं' : 'है'}?"
        end
      when 'How old is that person?'
        t = use_plural ? ['these', 'those'].sample : ['this', 'that'].sample
        person = Noun.find_by_english(gender == :male ? ['boy', 'man'].sample : ['girl', 'woman'].sample)
        q = "How old #{use_plural ? 'are' : 'is'} #{t} #{use_plural ? person.english_plural : person.english}?"
        a = Hindi::get_subject_objects(english_subject: t).first
        answers << "#{a[:transliterated]} #{use_plural ? person.transliterated_plural : person.transliterated} kitne sal #{Hindi::conjugate_ka({ output: 'transliterated', noun: person, use_plural: use_plural })} hai?"
      end
      obj = {
        question: q,
        answers: answers.uniq
      }
    when 'Hindi - Single Noun'
      @noun = get_noun(quiz_question)
      use_plural = random_boolean
      answers = []
      @noun.synonyms.each do |synonym|
        answers << (use_plural ? synonym.transliterated_plural : synonym.transliterated)
        answers << (use_plural ? synonym.foreign_plural : synonym.foreign)
      end
      obj = {
        wordId: noun.id,
        entity: 'noun',
        streak: noun.streak,
        lastStreakAdd: noun.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: get_english_plural(use_plural, @noun).capitalize,
        answers: answers.uniq,
        description: 'noun',
        tags: noun.tags.pluck(:name)
      }
    when 'Hindi - Single Verb'
      verb = get_verb(quiz_question)
      obj = {
        wordId: verb.id,
        entity: 'verb',
        streak: verb.streak,
        lastStreakAdd: verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: verb.english.capitalize,
        answers: [
          verb.transliterated_infinitive,
          verb.infinitive
        ],
        description: 'verb',
        tags: verb.tags.pluck(:name)
      }
    when 'Hindi - Single Adjective'
      adjective = Hindi::get_adjective(quiz_question, @adjectives)
      obj = {
        wordId: adjective.id,
        entity: 'adjective',
        streak: adjective.streak,
        lastStreakAdd: adjective.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: adjective.english.capitalize,
        answers: [
          adjective.transliterated_masculine,
          adjective.masculine
        ],
        description: 'adjective',
        tags: adjective.tags.pluck(:name)
      }
    when 'Hindi - Does Subject know that...?'
      english_subject = get_random_single_english_subject
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject)
      noun = get_noun(quiz_question)
      adjective = @adjectives.pop
      synonyms = noun.synonyms
      answers = []
      synonyms.each do |synonym|
        subject_objects.each do |subject_object|
          oblique_subject = Hindi::obliqify_subject(subject_object[:transliterated])
          answers += [
            "kya #{oblique_subject[:transliterated]} malum hai ki #{synonym.transliterated_plural} #{synonym.gender.odd? ? (synonym.uncountable ? adjective.transliterated_masculine : adjective.transliterated_masculine_plural) : adjective.transliterated_feminine} #{synonym.gender.odd? ? (synonym.uncountable ? 'hota' : 'hote') : 'hoti'} hai?",
            "क्या #{oblique_subject[:hindi]} मालूम है कि #{synonym.foreign_plural} #{synonym.gender.odd? ? (synonym.uncountable ? adjective.masculine : adjective.masculine_plural) : adjective.feminine} #{synonym.gender.odd? ? (synonym.uncountable ? 'होता' : 'होते') : 'होती'} हैं?"
          ]
        end
      end
      obj = {
        question: "#{['he', 'she', 'it', 'this', 'that'].include?(english_subject) ? 'Does' : 'Do'} #{english_subject} know that #{noun.english_plural} #{noun.uncountable ? 'is' : 'are'} #{adjective.english}?",
        answers: answers.uniq
      }
    when 'Hindi - Subject knows that...'
      english_subject = get_random_single_english_subject
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject)
      noun = get_noun(quiz_question)
      adjective = @adjectives.pop
      synonyms = noun.synonyms
      answers = []
      synonyms.each do |synonym|
        subject_objects.each do |subject_object|
          oblique_subject = Hindi::obliqify_subject(subject_object[:transliterated])
          answers += [
            "#{oblique_subject[:transliterated]} malum hai ki #{synonym.transliterated_plural} #{synonym.gender.odd? ? (synonym.uncountable ? adjective.transliterated_masculine : adjective.transliterated_masculine_plural) : adjective.transliterated_feminine} #{synonym.gender.odd? ? (synonym.uncountable ? 'hota' : 'hote') : 'hoti'} hai",
            "#{oblique_subject[:hindi]} मालूम है कि #{synonym.foreign_plural} #{synonym.gender.odd? ? (synonym.uncountable ? adjective.masculine : adjective.masculine_plural) : adjective.feminine} #{synonym.gender.odd? ? (synonym.uncountable ? 'होता' : 'होते') : 'होती'} हैं"
          ]
        end
      end
      obj = {
        question: "#{english_subject.capitalize} know#{['he', 'she', 'it', 'this', 'that'].include?(english_subject) ? 's' : ''} that #{noun.english_plural} #{noun.uncountable ? 'is' : 'are'} #{adjective.english}.",
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
      obj = {
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
      obj = {
        question: "Where can you get #{adjective.english} #{noun.english_plural}?",
        answers: answers
      }
    when 'Hindi - Availability'
      noun = get_noun(quiz_question)
      adjective = @adjectives.pop
      synonyms = noun.synonyms
      answers = []
      location = get_location
      synonyms.each do |synonym|
        answers += [
          "#{location[:transliterated]} #{synonym.gender.odd? ? (synonym.uncountable ? adjective.transliterated_masculine : adjective.transliterated_masculine_plural) : adjective.transliterated_feminine} #{synonym.uncountable ? synonym.transliterated : synonym.transliterated_plural} #{synonym.gender.odd? ? (synonym.uncountable ? 'milta' : 'milte') : 'milti'} hai",
          "#{location[:hindi]} #{synonym.gender.odd? ? (synonym.uncountable ? adjective.masculine : adjective.masculine_plural) : adjective.feminine} #{synonym.uncountable ? synonym.foreign : synonym.foreign_plural} #{synonym.gender.odd? ? (synonym.uncountable ? 'मिलता' : 'मिलते') : 'मिलती'} हैं"
        ]
      end
      obj = {
        question: "#{adjective.english.capitalize} #{noun.english_plural} #{noun.uncountable ? 'is' : 'are'} available #{location[:english]}.",
        answers: answers
      }
    when 'Hindi - Where is Subject\'s Noun?'
      @noun = get_noun(quiz_question)
      english_subject = English::get_random_english_subject
      english_subject = English::convert_unusable_subjects_for_posession_conversion(english_subject)
      subject_use_plural, notification = English::get_plural_from_subject(english_subject)
      noun_use_plural = @noun.uncountable ? false : [true, false].sample
      possession_objects = Hindi::get_possession_objects(english_subject, subject_use_plural)
      obj = {
        question: "Where #{noun_use_plural ? 'are' : 'is'} #{English::get_possessive_from_subject(english_subject)} #{noun_use_plural ? @noun[:english_plural] : @noun[:english]}?#{notification}",
        answers: all_synonyms(possession_objects.map do |possession_object|
          proper_possession_object = proper_possession({ possession_object: possession_object, noun: @noun, noun_plural: noun_use_plural })
          [
            "#{proper_possession_object[:transliterated]} #{noun_use_plural ? @noun[:transliterated_plural] : @noun[:transliterated]} kaha hai?",
            "#{proper_possession_object[:hindi]} #{noun_use_plural ? @noun[:foreign_plural] : @noun[:foreign]} कहाँ है?"
          ]
        end.flatten.uniq, noun_use_plural)
      }
    when 'Hindi - The Noun is Preposition the Adjective Noun'
      @noun = get_noun(quiz_question)
      use_noun_plural = @noun.uncountable ? false : random_boolean
      noun_english, noun_transliterated, noun_hindi = get_proper_words_from_plural({ noun: @noun, plural: use_noun_plural })
      preposition = get_preposition
      @noun2 = get_noun(quiz_question)
      use_noun2_plural = @noun2.uncountable ? false : random_boolean
      noun2_english, noun2_transliterated, noun2_hindi = get_proper_words_from_plural({ noun: @noun2, plural: use_noun2_plural })
      @adjective = @adjectives.pop
      hindi_answers = [
        "#{noun_hindi} #{Hindi::obliqify({ adjective_hindi: @adjective, noun_hindi: @noun2, use_plural: use_noun2_plural })} #{Hindi::obliqify({ noun_hindi: @noun2, use_plural: use_noun2_plural })} #{preposition[:hindi]} है"
      ]
      transliterated_answers = [
        "#{noun_transliterated} #{Hindi::obliqify({ adjective_transliterated: @adjective, noun_transliterated: @noun2, use_plural: use_noun2_plural })} #{Hindi::obliqify({ noun_transliterated: @noun2, use_plural: use_noun2_plural })} #{preposition[:transliterated]} hai"
      ]
      obj = {
        question: "The #{noun_english} #{use_noun_plural ? 'are' : 'is'} #{preposition[:english]} the #{@adjective.english} #{oblique_plural_notification(use_noun2_plural, noun2_english, @noun2)}.",
        answers: all_synonyms(hindi_answers, use_noun_plural, use_noun2_plural) + all_synonyms(transliterated_answers, use_noun_plural, use_noun2_plural)
      }
    when 'Hindi - There is a Noun Preposition the Adjective Noun'
      @noun = get_noun(quiz_question)
      use_noun_plural = @noun.uncountable ? false : [true, false].sample
      noun_english, noun_transliterated, noun_hindi = get_proper_words_from_plural({ noun: @noun, plural: use_noun_plural })
      preposition = get_preposition
      @noun2 = get_noun(quiz_question)
      use_noun2_plural = @noun2.uncountable ? false : [true, false].sample
      noun2_english, noun2_transliterated, noun2_hindi = get_proper_words_from_plural({ noun: @noun2, plural: use_noun2_plural })
      @adjective = @adjectives.pop
      hindi_answers = [
        "#{Hindi::obliqify({ adjective_hindi: @adjective, noun_hindi: @noun2, use_plural: use_noun2_plural })} #{Hindi::obliqify({ noun_hindi: @noun2, use_plural: use_noun2_plural })} #{preposition[:hindi]} #{noun_hindi} है"
      ]
      transliterated_answers = [
        "#{Hindi::obliqify({ adjective_transliterated: @adjective, noun_transliterated: @noun2, use_plural: use_noun2_plural })} #{Hindi::obliqify({ noun_transliterated: @noun2, use_plural: use_noun2_plural })} #{preposition[:transliterated]} #{noun_transliterated} hai"
      ]
      obj = {
        question: "There #{use_noun_plural && !@noun.uncountable ? 'are' : "is #{@noun.uncountable ? '' : a_or_an(noun_english)}"} #{noun_english} #{preposition[:english]} the #{@adjective.english} #{oblique_plural_notification(use_noun2_plural, noun2_english, @noun2)}.",
        answers: all_synonyms(hindi_answers) + all_synonyms(transliterated_answers)
      }
    when 'Hindi - Subject is a Noun'
      @noun = get_noun(quiz_question)
      english_subject = (@noun.uncountable? ? English::get_random_single_english_subject : English::get_random_english_subject)
      subject_gender, use_plural, notification = English::get_gender_and_plural_from_subject(english_subject, ignore_subject_gender: true)
      use_plural = use_plural && @noun.countable?
      use_past, english_be_symbol, hindi_be_symbol, transliterated_be_symbol = set_past_symbols
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, gender: @noun.gender_symbol, use_plural: use_plural)
      question_subject_object = subject_objects.sample
      answers = []
      subject_objects.map do |subject_object|
        @noun.synonyms.each do |synonym|
          answers << "#{subject_object[:transliterated]} #{use_plural ? synonym[:transliterated_plural] : synonym[:transliterated]} #{subject_object[transliterated_be_symbol]}"
          answers << "#{subject_object[:hindi]} #{use_plural ? synonym[:foreign_plural] : synonym[:foreign]} #{subject_object[hindi_be_symbol]}"
          unless use_plural
            answers << "#{subject_object[:transliterated]} ek #{synonym[:transliterated]} #{subject_object[transliterated_be_symbol]}"
            answers << "#{subject_object[:hindi]} एक #{synonym[:foreign]} #{subject_object[hindi_be_symbol]}"
          end
        end
      end
      obj = {
        question: "#{question_subject_object[:english].capitalize} #{question_subject_object[english_be_symbol]}#{use_plural ? " #{@noun[:english_plural]}" : "#{(@noun.countable? ? " #{a_or_an(@noun[:english])}" : '')} #{@noun[:english]}"}.#{notification}",
        answers: answers
      }
    when 'Hindi - Subject is Adjective'
      adjective = @adjectives.pop
      english_subject = English::get_random_english_subject
      gender, use_plural, notification = English::get_gender_and_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject)
      use_past, english_be_symbol, hindi_be_symbol, transliterated_be_symbol = set_past_symbols
      question_subject_object = subject_objects.sample
      transliterated_adjectives, hindi_adjectives = proper_adjective_forms({ adjective: adjective, subject: question_subject_object[:english] })
      hindi_answers = subject_objects.map do |hash|
        hindi_adjectives.map do |adj|
          "#{hash[:hindi]} #{adj} #{hash[hindi_be_symbol]}"
        end
      end.flatten.uniq
      transliterated_answers = subject_objects.map do |hash|
        transliterated_adjectives.map do |adj|
          "#{hash[:transliterated]} #{adj} #{hash[transliterated_be_symbol]}"
        end
      end.flatten.uniq
      obj = {
        question: "#{question_subject_object[:english].capitalize} #{question_subject_object[english_be_symbol]} #{adjective[:english]}.#{use_past ? notification : ''}",
        answers: hindi_answers + transliterated_answers
      }
    when 'Hindi - Subject is an Adjective Noun'
      english_subject = English::get_random_english_subject
      gender, use_plural, notification = English::get_gender_and_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural)
      question_subject_object = subject_objects.first
      @noun = get_noun(quiz_question)
      until @noun.countable?
        @noun = get_noun(quiz_question)
      end
      synonyms = @noun.synonyms
      adjective = @adjectives.pop
      answers = []
      subject_objects.each do |hash|
        synonyms.each do |synonym|
          masculine_adjective = (use_plural && @noun.countable?) ? adjective[:masculine_plural] : adjective[:masculine]
          transliterated_masculine_adjective = (use_plural && @noun.countable?) ? adjective[:transliterated_masculine_plural] : adjective[:transliterated_masculine]
          answers << "#{hash[:transliterated]} #{synonym[:gender] == 1 ? transliterated_masculine_adjective : adjective[:transliterated_feminine]} #{synonym[use_plural ? :transliterated_plural : :transliterated]} #{hash[:transliterated_be]}"
          answers << "#{hash[:hindi]} #{synonym[:gender] == 1 ? masculine_adjective : adjective[:feminine]} #{synonym[use_plural ? :foreign_plural : :foreign]} #{hash[:hindi_be]}"
          answers << "#{hash[:transliterated]} ek #{synonym[:gender] == 1 ? transliterated_masculine_adjective : adjective[:transliterated_feminine]} #{synonym[use_plural ? :transliterated_plural : :transliterated]} #{hash[:transliterated_be]}" unless use_plural
          answers << "#{hash[:hindi]} एक #{synonym[:gender] == 1 ? masculine_adjective : adjective[:feminine]} #{synonym[use_plural ? :foreign_plural : :foreign]} #{hash[:hindi_be]}" unless use_plural
        end
      end
      obj = {
        question: "#{question_subject_object[:english].capitalize} #{question_subject_object[:english_be]} #{use_plural ? '' : (a_or_an(adjective[:english]) + ' ')}#{adjective[:english]} #{@noun[use_plural ? :english_plural : :english]}.#{notification}",
        answers: answers
      }
    when 'Hindi - Subject has a Noun'
      subject = English::get_random_english_subject
      use_subject_plural, subject_plural_notification = English::get_plural_from_subject(subject)
      subject_objects = Hindi::get_subject_objects(english_subject: subject, use_plural: use_subject_plural)
      @noun = get_noun(quiz_question)
      use_noun_plural = @noun.uncountable ? false : [true, false].sample
      tags = @noun.tags.pluck(:name)
      if (tags & ['Body Part', 'Relative', 'Real Estate']).present?
        subject_has_objects = Hindi::get_subject_has_objects_using_ka(subject_objects: subject_objects, gender: @noun.english_gender, plural: use_noun_plural)
      else
        subject_has_objects = Hindi::get_subject_has_objects(subject_objects)
      end
      use_article = !use_noun_plural && @noun.countable?
      answers = []
      @noun.synonyms.each do |synonym|
        subject_has_objects.map.with_index do |subject_has_object, index|
          answers << "#{subject_has_object[:transliterated]} #{use_noun_plural ? synonym.transliterated_plural : synonym.transliterated} hai"
          answers << "#{subject_has_object[:transliterated]} #{use_article ? 'ek ' : ''}#{use_noun_plural ? synonym.transliterated_plural : synonym.transliterated} hai"
          answers << "#{subject_has_object[:hindi]} #{use_noun_plural ? synonym.foreign_plural : synonym.foreign} #{use_noun_plural ? 'हैं' : 'है'}"
          answers << "#{subject_has_object[:hindi]} #{use_article ? 'एक ' : ''}#{use_noun_plural ? synonym.foreign_plural : synonym.foreign} #{use_noun_plural ? 'हैं' : 'है'}"
        end
      end
      obj = {
        question: "#{subject_has_objects.first[:english].capitalize}#{subject_plural_notification} #{use_article ? "#{a_or_an(@noun.english)} " : ''}#{get_english_plural(use_noun_plural, @noun)}.",
        answers: answers.uniq
      }
    when 'Hindi - Subject has an Adjective Noun'
      subject = English::get_random_english_subject
      use_subject_plural, subject_plural_notification = English::get_plural_from_subject(subject)
      subject_objects = Hindi::get_subject_objects(english_subject: subject, use_plural: use_subject_plural)
      subject_has_objects = Hindi::get_subject_has_objects(subject_objects)
      @noun = get_noun(quiz_question)
      use_noun_plural = @noun.uncountable ? false : [true, false].sample
      use_article = !use_noun_plural && @noun.countable?
      adjective = @adjectives.pop
      transliterated_adjectives, hindi_adjectives = proper_adjective_forms({ adjective: adjective, noun: @noun, plural: use_noun_plural })
      answers = []
      @noun.synonyms.each do |synonym|
        subject_has_objects.map.with_index do |subject_has_object, index|
          answers << "#{subject_has_object[:transliterated]} #{transliterated_adjectives.first} #{use_noun_plural ? synonym.transliterated_plural : synonym.transliterated} hai"
          answers << "#{subject_has_object[:transliterated]} #{use_article ? 'ek ' : ''}#{transliterated_adjectives.first} #{use_noun_plural ? synonym.transliterated_plural : synonym.transliterated} hai"
          answers << "#{subject_has_object[:hindi]} #{hindi_adjectives.first} #{use_noun_plural ? synonym.foreign_plural : synonym.foreign} #{use_noun_plural ? 'हैं' : 'है'}"
          answers << "#{subject_has_object[:hindi]} #{use_article ? 'एक ': ''}#{hindi_adjectives.first} #{use_noun_plural ? synonym.foreign_plural : synonym.foreign} #{use_noun_plural ? 'हैं' : 'है'}"
        end
      end
      obj = {
        question: "#{subject_has_objects.first[:english].capitalize}#{subject_plural_notification} #{use_article ? "#{a_or_an(adjective.english)} " : ''}#{adjective.english} #{get_english_plural(use_noun_plural, @noun)}.",
        answers: answers.uniq
      }
    when 'Hindi - Noun Gender'
      noun = get_noun(quiz_question)
      obj = {
        question: noun.foreign,
        answers: [
          noun.gender == 1 ? 'm' : 'f'
        ]
      }
    when 'Hindi - Noun Plural'
      noun = get_noun(quiz_question)
      obj = {
        question: noun[:foreign],
        answers: [
          noun[:transliterated_plural],
          noun[:foreign_plural]
        ]
      }
    when 'Hindi - Noun is Adjective'
      @noun = get_noun(quiz_question)
      adjective = @adjectives.pop
      if @noun.uncountable
        use_plural = false
      else
        use_plural = [true, false].sample
      end
      if use_plural
        english_subject = ['the', 'these', 'those'].sample
      else
        english_subject = ['the', 'this', 'that'].sample
      end
      subject_object = english_subject == 'the' ? nil : Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural).first
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
      obj = {
        question: use_plural ? plural_question : single_question,
        answers: all_synonyms([
          use_plural ? plural_answers : single_answers
        ].flatten, use_plural)
      }
    when 'Hindi - Imperfective Present Yes/No Question'
      english_subject = English::get_random_english_subject
      gender, gender_notification = get_gender_from_subject(english_subject)
      plural, subject_plural_notification = English::get_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: plural)
      verb = @verbs.pop
      do_verb = Verb.find_by_english('do')
      obj = {
        question: "#{do_verb.english_imperfective(english_subject, plural).capitalize} #{english_subject == 'I' ? 'I' : english_subject.downcase}#{subject_plural_notification} #{verb.english}?#{gender_notification}",
        answers: subject_objects.map do |subject_object|
          [
            "kya #{subject_object[:transliterated]} #{verb.transliterated_imperfective({ gender: gender, plural: plural })} #{subject_object[:transliterated_be]}?",
            "क्या #{subject_object[:hindi]} #{verb.hindi_imperfective({ gender: gender, plural: plural })} #{subject_object[:hindi_be]}?"
          ]
        end.flatten.uniq
      }
    when 'Hindi - Imperfective Present Question'
      question_word = get_question_word
      english_subject = English::get_random_english_subject
      gender, gender_notification = get_gender_from_subject(english_subject)
      plural, subject_plural_notification = English::get_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: plural)
      verb = @verbs.pop
      do_verb = Verb.find_by_english('do')
      obj = {
        question: "#{question_word[:english].capitalize} #{do_verb.english_imperfective(english_subject, plural)} #{english_subject == 'I' ? 'I' : english_subject.downcase} #{verb.english}?#{gender_notification}#{subject_plural_notification}",
        answers: subject_objects.map do |subject_object|
          [
            "#{subject_object[:transliterated]} #{question_word[:transliterated]} #{verb.transliterated_imperfective({ gender: gender, plural: plural })} #{subject_object[:transliterated_be]}?",
            "#{subject_object[:hindi]} #{question_word[:hindi]} #{verb.hindi_imperfective({ gender: gender, plural: plural })} #{subject_object[:hindi_be]}?"
          ]
        end.flatten.uniq
      }
    when 'Hindi - Imperfective Present'
      english_subject = English::get_random_english_subject
      use_plural = ['you', 'these', 'those', 'they'].include?(english_subject)
      gender, gender_notification = get_gender_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject)
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
      obj = {
        question: "#{english_subject.capitalize} #{english_negative_verb(use_negative, english_subject)}#{verb.english_imperfective(english_subject, use_negative)}#{extra_eng}.#{gender_notification}",
        answers: subject_objects.map do |subject_object|
          [
            "#{subject_object[:transliterated]} #{extra_trans}#{negative_trans}#{verb.transliterated_imperfective({ gender: gender, plural: use_plural })} #{subject_object[:transliterated_be]}",
            "#{subject_object[:hindi]} #{extra_hindi}#{negative_hindi}#{verb.hindi_imperfective({ gender: gender, plural: use_plural })} #{subject_object[:hindi_be]}",
            (use_negative ? "#{subject_object[:transliterated]} #{extra_trans}#{negative_trans}#{verb.transliterated_imperfective({ gender: gender, plural: use_plural })}" : nil),
            (use_negative ? "#{subject_object[:hindi]} #{extra_hindi}#{negative_hindi}#{verb.hindi_imperfective({ gender: gender, plural: use_plural })}" : nil)
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
      obj = {
        question: question_text.slice(0, 1).capitalize + question_text.slice(1..-1),
        answers: [
          hindi_answers,
          transliterated_answers
        ].flatten
      }
    when 'Hindi - Subject likes Noun'
      english_subject = English::get_random_english_subject
      use_plural, notification = English::get_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural)
      english_like_plural = english_subject.downcase.in?(['he', 'she', 'it', 'this', 'that'])
      @noun = get_noun(quiz_question)
      synonyms = @noun.synonyms
      answers = []
      synonyms.each do |synonym|
        subject_objects.each do |subject_object|
          oblique_subject = Hindi::obliqify_subject(subject_object[:transliterated])
          answers << "#{oblique_subject[:transliterated]} #{synonym.transliterated_plural} pasand hai"
          answers << "#{oblique_subject[:hindi]} #{synonym.foreign_plural} पसंद हैं"
        end
      end
      obj = {
        question: "#{english_subject.capitalize} like#{english_like_plural ? 's' : ''} #{@noun.english_plural}. #{notification}",
        answers: answers.uniq
      }
    when 'Hindi - Does Subject like Noun?'
      english_subject = English::get_random_english_subject
      use_do = ['you', 'these', 'those', 'they', 'we', 'I'].include?(english_subject)
      use_plural, notification = English::get_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural)
      @noun = get_noun(quiz_question)
      synonyms = @noun.synonyms
      answers = []
      synonyms.each do |synonym|
        subject_objects.each do |subject_object|
          oblique_subject = Hindi::obliqify_subject(subject_object[:transliterated])
          answers << "kya #{oblique_subject[:transliterated]} #{synonym.transliterated_plural} pasand hai?"
          answers << "क्या #{oblique_subject[:hindi]} #{synonym.foreign_plural} पसंद हैं?"
        end
      end
      obj = {
        question: "#{use_do ? 'Do' : 'Does'} #{english_subject} like #{@noun.english_plural}? #{notification}",
        answers: answers.uniq
      }
    when 'Hindi - Subject wants a Noun'
      english_subject = English::get_random_english_subject
      subject_is_plural, notification = English::get_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: subject_is_plural)
      question_subject_object = subject_objects.first
      use_want = ['you', 'these', 'those', 'they', 'we', 'I'].include?(english_subject)
      @noun = get_noun(quiz_question)
      use_noun_plural = @noun.countable? ? random_boolean : false
      synonyms = @noun.synonyms
      answers = []
      synonyms.each do |synonym|
        subject_objects.each do |subject_object|
          oblique_subject = Hindi::obliqify_subject(subject_object[:transliterated])
          answers << "#{oblique_subject[:transliterated]} #{use_noun_plural ? synonym.transliterated_plural : synonym.transliterated} chahie"
          answers << "#{oblique_subject[:transliterated]} ek #{synonym.transliterated} chahie" unless use_noun_plural
          answers << "#{oblique_subject[:hindi]} #{use_noun_plural ? synonym.foreign_plural : synonym.foreign} चाहिए"
          answers << "#{oblique_subject[:hindi]} एक #{synonym.foreign} चाहिए" unless use_noun_plural
        end
      end
      obj = {
        question: "#{english_subject.capitalize} want#{use_want ? '' : 's'} #{use_noun_plural || @noun.uncountable? ? '' : a_or_an(@noun.english) + ' '}#{use_noun_plural ? @noun.english_plural : @noun.english}.#{notification}",
        answers: answers.uniq
      }
    when 'Hindi - Does Subject want a Noun?'
      english_subject = English::get_random_english_subject
      use_do = ['you', 'these', 'those', 'they', 'we', 'I'].include?(english_subject)
      use_plural, notification = English::get_plural_from_subject(english_subject)
      subject_objects = Hindi::get_subject_objects(english_subject: english_subject, use_plural: use_plural)
      @noun = get_noun(quiz_question)
      synonyms = @noun.synonyms
      answers = []
      synonyms.each do |synonym|
        subject_objects.each do |subject_object|
          oblique_subject = Hindi::obliqify_subject(subject_object[:transliterated])
          answers << "kya #{oblique_subject[:transliterated]} #{use_plural ? synonym.transliterated_plural : synonym.transliterated} chahie?"
          answers << "kya #{oblique_subject[:transliterated]} ek #{synonym.transliterated} chahie?" unless use_plural
          answers << "क्या #{oblique_subject[:hindi]} #{use_plural ? synonym.foreign_plural : synonym.foreign} चाहिए?"
          answers << "क्या #{oblique_subject[:hindi]} एक #{synonym.foreign} चाहिए?" unless use_plural
        end
      end
      obj = {
        question: "#{use_do ? 'Do' : 'Does'} #{english_subject} want #{use_plural ? '' : a_or_an(@noun.english) + ' '}#{use_plural ? @noun.english_plural : @noun.english}?#{notification}",
        answers: answers.uniq
      }
    when "Hindi - Noun's Noun"
      noun_1 = get_noun(quiz_question)
      noun_1_synonyms = noun_1.synonyms
      noun_2 = get_noun(quiz_question)
      noun_2_synonyms = noun_2.synonyms
      if noun_2.uncountable?
        use_plural = false
      else
        use_plural = [true, false].sample
      end
      answers = []
      noun_1_synonyms.each do |noun_1_synonym|
        noun_2_synonyms.each do |noun_2_synonym|
          answers << "#{use_plural ? 'ye' : 'yah'} #{Hindi::obliqify({ noun_transliterated: noun_1_synonym })} #{Hindi::conjugate_ka(output: 'transliterated', noun: noun_2_synonym, use_plural: use_plural)} #{use_plural ? noun_2_synonym[:transliterated_plural] : noun_2_synonym[:transliterated]} hai"
          answers << "#{use_plural ? 'ये' : 'यह'} #{Hindi::obliqify({ noun_hindi: noun_1_synonym })} #{Hindi::conjugate_ka(output: 'hindi', noun: noun_2_synonym, use_plural: use_plural)} #{use_plural ? noun_2_synonym[:foreign_plural] : noun_2_synonym[:foreign]} #{use_plural ? 'हैं' : 'है'}"
        end
      end
      obj = {
        question: "#{use_plural ? 'These are' : 'This is'} the #{English::possession(noun_1[:english])} #{use_plural ? noun_2[:english_plural] : noun_2[:english]}.",
        answers: answers
      }
    when 'Spanish - Single Noun'
      noun = Spanish::get_noun(quiz_question, @spanish_nouns)
      synonyms = noun.synonyms
      plural = (rand(2) == 1)
      obj = {
        wordId: noun.id,
        entity: 'spanishNoun',
        streak: noun.streak,
        streakFreezeExpiration: noun.streak_freeze_expiration.to_i,
        lastStreakAdd: noun.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: Spanish::display_plural_with_notification({ noun: noun, use_plural: plural }).capitalize,
        answers: [
          plural ? noun.spanish_plural : noun.spanish
        ],
        indeterminate: noun.just_synonyms.map do |noun|
          (plural ? noun.spanish_plural : noun.spanish)
        end,
        description: 'noun',
        highlightButton: true,
        tags: noun.tags.pluck(:name),
        note: noun.note
      }
    when 'Spanish - Single Verb'
      verb = Spanish::get_verb(quiz_question, @spanish_verbs)
      synonyms = verb.synonyms
      obj = {
        wordId: verb.id,
        entity: 'spanishVerb',
        streak: verb.streak,
        streakFreezeExpiration: verb.streak_freeze_expiration.to_i,
        lastStreakAdd: verb.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: verb.english.capitalize,
        indeterminate: verb.just_synonyms.map do |verb|
          verb.spanish
        end,
        answers: [
          verb.spanish
        ],
        description: 'verb',
        highlightButton: true,
        tags: verb.tags.pluck(:name),
        note: verb.note
      }
    when 'Spanish - Single Adjective'
      adjective = Spanish::get_adjective(quiz_question, @spanish_adjectives)
      synonyms = adjective.synonyms
      obj = {
        wordId: adjective.id,
        entity: 'spanishAdjective',
        streak: adjective.streak,
        streakFreezeExpiration: adjective.streak_freeze_expiration.to_i,
        lastStreakAdd: adjective.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: adjective.english.capitalize,
        answers: [
          adjective.masculine,
          adjective.feminine
        ],
        indeterminate: adjective.just_synonyms.map do |adjective|
          [ adjective.masculine, adjective.feminine ]
        end.flatten,
        description: 'adjective',
        highlightButton: true,
        tags: adjective.tags.pluck(:name)
      }
    when 'Spanish - Misc Word'
      word = Spanish::get_misc_word(quiz_question, @spanish_miscs)
      obj = {
        wordId: word.id,
        entity: 'spanishMisc',
        streak: word.streak,
        streakFreezeExpiration: word.streak_freeze_expiration.to_i,
        lastStreakAdd: word.last_streak_add.try(:in_time_zone, "America/New_York").try(:to_time).try(:to_i),
        question: word.english.capitalize,
        answers: [ word.spanish ],
        highlightButton: true,
        tags: word.tags.pluck(:name)
      }
    when 'Spanish - Noun is Adjective'
      # TODO: add 'this/these' and 'that/those' articles
      noun = Spanish::get_noun(quiz_question, @spanish_nouns)
      noun_synonyms = noun.synonyms
      adjective = Spanish::get_adjective(quiz_question, @spanish_adjectives)
      adjective_synonyms = adjective.synonyms
      answers = []
      noun_synonyms.each do |noun_synonym|
        adjective_synonyms.each do |adjective_synonym|
          answers << "#{noun_synonym.with_article(article: 'definite').capitalize} #{Spanish::conjugate_ser(noun: noun_synonym)} #{adjective_synonym.conjugate(gender: noun_synonym.gender)}."
        end
      end
      obj = {
        question: "The #{noun.english} is #{adjective.english}.",
        answers: answers
      }
    when 'Spanish - Subject is Adjective'
      adjective = Spanish::get_adjective(quiz_question, @spanish_adjectives)
      english_subject = English::get_random_english_subject
      gender, subject_use_plural, notification = English::get_gender_and_plural_from_subject(english_subject)
      subject_object = Spanish::get_subject_object(english_subject: english_subject, gender: gender, use_plural: subject_use_plural)
      answers = []
      adjective.synonyms.each do |synonym|
        answers << "#{subject_object[:spanish].capitalize} #{Spanish::conjugate_ser(subject: subject_object[:spanish])} #{synonym.conjugate(gender: gender, use_plural: subject_use_plural)}."
      end
      obj = {
        question: "#{subject_object[:english].capitalize} #{subject_object[:english_be]} #{adjective.english}.#{notification}",
        answers: answers
      }
    when 'Spanish - Number'
      numbers = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte']
      tens = ['treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa', 'cien']
      n = rand(1..100)
      if n <= 20
        answer = numbers[n - 1]
      elsif n > 20 && n < 30
        answer = "veinti#{numbers[n - 21]}".gsub('dos', 'dós').gsub('tres', 'trés').gsub('seis', 'séis')
      else
        ten = n / 10
        one = n % 10
        answer = "#{tens[ten - 3]}#{one.zero? ? '' : " y #{numbers[one - 1]}"}"
      end
      obj = {
        question: n,
        answers: [
          answer
        ]
      }
    when 'Spanish - Weekdays'
      english = English.get_random_weekday
      obj = {
        question: english,
        answers: [
          Spanish.get_weekday(english)[:spanish]
        ]
      }
    when 'Hindi - Weekdays'
      english = English.get_random_weekday
      obj = {
        question: english,
        answers: [
          Hindi.get_weekday(english)[:hindi],
          Hindi.get_weekday(english)[:transliterated]
        ]
      }
    when 'Spanish - Month'
      month = Spanish.get_month(@spanish_months)
      obj = {
        question: month[:english],
        answers: [
          month[:spanish]
        ]
      }
    when 'Spanish - Present Simple Tense'
      verb = Spanish.get_verb(quiz_question, @spanish_verbs)
      until verb.forms['present'].present?
        verb = Spanish.get_verb(quiz_question, @spanish_verbs)
      end
      spanish_subject_pronoun = Spanish.random_subject
      english_subject_pronoun, female_only, is_formal = English.subject_pronoun(spanish_pronoun: spanish_subject_pronoun).values_at(:pronoun, :female_only, :is_formal)
      answers = verb.synonyms.map do |synonym|
        next if synonym.forms['present'].nil?
        spanish_verb_conjugation = synonym.forms['present'][Spanish.verb_forms_key(spanish_subject_pronoun)]
        [
          "#{spanish_subject_pronoun} #{spanish_verb_conjugation}.".capitalize,
          "#{spanish_verb_conjugation}.".capitalize
        ]
      end
      description = female_only.present? ? 'Only Females' : nil
      description = 'Formal' if is_formal.present?
      obj = {
        question: "#{english_subject_pronoun} #{verb.english_conjugation(spanish_pronoun: spanish_subject_pronoun)}.".capitalize,
        answers: answers.flatten,
        description: description,
      }
    when 'Spanish - Present Continuous Tense'
      verb = Spanish.get_verb(quiz_question, @spanish_verbs)
      spanish_subject_pronoun = Spanish.random_subject
      english_subject_pronoun, female_only = English.subject_pronoun(spanish_pronoun: spanish_subject_pronoun).values_at(:pronoun, :female_only)
      answers = verb.synonyms.map do |synonym|
        [
          "#{spanish_subject_pronoun} #{verb.reflexive? ? "#{Spanish.reflexive_pronoun(spanish_subject_pronoun)} " : ""}#{Spanish.conjugate_estar(subject: spanish_subject_pronoun)} #{synonym.present_continuous}.".capitalize,
          "#{verb.reflexive? ? "#{Spanish.reflexive_pronoun(spanish_subject_pronoun)} " : ""}#{Spanish.conjugate_estar(subject: spanish_subject_pronoun)} #{synonym.present_continuous}.".capitalize
        ]
      end
      obj = {
        question: "#{english_subject_pronoun} #{English.conjugate_be(subject: english_subject_pronoun)} #{verb.english_continuous}.".capitalize,
        answers: answers.flatten,
        description: female_only.present? ? 'Only Females' : nil
      }
    else
      raise "No logic for #{question.name}"
    end
    obj
  end

  private

  def set_past_symbols
    use_past = random_boolean
    english_be_symbol = use_past ? :english_be_past : :english_be
    hindi_be_symbol = use_past ? :hindi_be_past : :hindi_be
    transliterated_be_symbol = use_past ? :transliterated_be_past : :transliterated_be
    [use_past, english_be_symbol, hindi_be_symbol, transliterated_be_symbol]
  end

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

  def get_cards(quiz_questions)
    result = []
    all_archived_cards = Card.includes(:tags).where(tags: { name: 'Archived' })
    use_all_cards_tag_ids = quiz_questions.select { |quiz_question| quiz_question.use_all_available }.map { |quiz_question| quiz_question.tag_id }
    Tag.all.each do |tag|
      if use_all_cards_tag_ids.include?(tag.id)
        tagged_cards = Card.includes(:tags).where(tags: { id: tag.id })
        result += (tagged_cards - all_archived_cards)
      else
        n = quiz_questions.reduce(0) do |sum, qq|
          if qq.tag_id == tag.id
            sum + qq.amount
          else
            sum
          end
        end
        if n > 0
          all_tagged_cards = Card.includes(:tags).where(tags: { id: tag.id })
          archived_tagged_cards = (all_tagged_cards & all_archived_cards).shuffle
          unarchived_tagged_cards = (all_tagged_cards - all_archived_cards).shuffle
          if n <= unarchived_tagged_cards.length
            result += unarchived_tagged_cards.take(n)
          else
            result += unarchived_tagged_cards
            result += archived_tagged_cards.take(n - unarchived_tagged_cards.length)
          end
        end
      end
    end
    result
  end

  def check_if_anything_empty
    @nouns = Noun.all.to_a.shuffle if @nouns.empty?
    @verbs = Verb.all.to_a.shuffle if @verbs.empty?
    @adjectives = Adjective.all.to_a.shuffle if @adjectives.empty?
    @adverbs = Adverb.all.to_a.shuffle if @adverbs.empty?
    @spanish_nouns = SpanishNoun.all.to_a.shuffle if @spanish_nouns.empty?
    @spanish_verbs = SpanishVerb.all.to_a.shuffle if @spanish_verbs.empty?
    @spanish_adjectives = SpanishAdjective.all.to_a.shuffle if @spanish_adjectives.empty?
    @spanish_miscs = SpanishMisc.all.to_a.shuffle if @spanish_miscs.empty?
    @spanish_months = Spanish.get_all_months if @spanish_months.empty?
    @french_nouns = FrenchNoun.all.to_a.shuffle if @french_nouns.empty?
    @french_verbs = FrenchVerb.all.to_a.shuffle if @french_verbs.empty?
    @french_adjectives = FrenchAdjective.all.to_a.shuffle if @french_adjectives.empty?
    @french_miscs = FrenchMisc.all.to_a.shuffle if @french_miscs.empty?
    @french_cities = FrenchCity.all.to_a.shuffle if @french_cities.empty?
    @french_countries = FrenchCountry.all.to_a.shuffle if @french_countries.empty?
  end

  def get_noun(quiz_question)
    if quiz_question.tag_id
      tagged_nouns = []
      until !tagged_nouns.empty? do
        tagged_nouns = @nouns.select { |noun| noun.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_nouns.empty?
          new_tagged_nouns = Noun.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
          raise "No Hindi Nouns with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_nouns.empty?
          @nouns += new_tagged_nouns
        end
      end
      noun = tagged_nouns.sample
      @nouns.reject! { |n| n == noun }
    else
      noun = @nouns.pop
    end
    noun
  end

  def get_verb(quiz_question)
    if quiz_question.tag_id
      tagged_verbs = []
      until !tagged_verbs.empty? do
        tagged_verbs = @verbs.select { |verb| verb.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_verbs.empty?
          new_tagged_verbs = Noun.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
          raise "No Hindi Verbs with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_verbs
          @verbs += new_tagged_verbs
        end
      end
      verb = tagged_verbs.sample
      @verbs.reject! { |v| v == verb }
    else
      verb = @verbs.pop
    end
    verb
  end

  def get_random_possession_english_subject
    ['my', 'your', 'our', 'his', 'her', 'its', 'their'][rand(7)]
  end

  def get_random_single_english_subject
    ['I', 'you', 'he', 'she', 'it', 'this', 'that'][rand(7)]
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
    if use_plural && english_single_plural_same && !noun.uncountable
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

  def get_gender_from_subject(subject)
    if ['I', 'he'].include?(subject)
      gender = 'male'
    elsif ['she'].include?(subject)
      gender = 'female'
    else
      gender = ['male', 'female'].sample
    end
    gender_notification = ['I', 'he', 'she'].include?(subject) ? '' : " (#{gender[0].capitalize})"
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

  def random_boolean
    [true, false].sample
  end

end
