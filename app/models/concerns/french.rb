module French

  VOWEL_SOUNDS = 'aeéèhiou'.split('')

  class << self

    def vowel_sound?(input)
      input.downcase.in?(VOWEL_SOUNDS)
    end

    def random_subject(override: nil)
      return override if override.present?
      ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'].sample
    end

    def get_noun(quiz_question, nouns)
      if quiz_question.tag_id
        tagged_nouns = []
        until !tagged_nouns.empty? do
          tagged_nouns = nouns.select { |noun| noun.tags.map(&:id).include?(quiz_question.tag_id) }
          if tagged_nouns.empty?
            new_tagged_nouns = FrenchNoun.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
            raise "No French Nouns with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_nouns.empty?
            nouns += new_tagged_nouns
          end
        end
        noun = tagged_nouns.sample
        nouns.reject! { |n| n == noun }
      else
        noun = nouns.pop
      end
      noun
    end

    def get_verb(quiz_question, verbs)
      if quiz_question.tag_id
        tagged_verbs = []
        until !tagged_verbs.empty? do
          tagged_verbs = verbs.select { |verb| verb.tags.map(&:id).include?(quiz_question.tag_id) }
          if tagged_verbs.empty?
            new_tagged_verbs = FrenchVerb.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
            raise "No French Verbs with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_verbs.empty?
            verbs += new_tagged_verbs
          end
        end
        verb = tagged_verbs.sample
        verbs.reject! { |v| v == verb }
      else
        verb = verbs.pop
      end
      verb
    end

    def get_adjective(quiz_question, adjectives)
      if quiz_question.tag_id
        tagged_adjectives = []
        until !tagged_adjectives.empty? do
          tagged_adjectives = adjectives.select { |adjective| adjective.tags.map(&:id).include?(quiz_question.tag_id) }
          if tagged_adjectives.empty?
            new_tagged_adjectives = FrenchAdjective.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
            raise "No French Adjectives with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_adjectives.empty?
            adjectives += new_tagged_adjectives
          end
        end
        adjective = tagged_adjectives.sample
        adjectives.reject! { |v| v == adjective }
      else
        adjective = adjectives.pop
      end
      adjective
    end

    def get_misc_word(quiz_question, words)
      if quiz_question.tag_id
        tagged_words = []
        until !tagged_words.empty? do
          tagged_words = words.select { |word| word.tags.map(&:id).include?(quiz_question.tag_id) }
          if tagged_words.empty?
            new_tagged_words = FrenchMisc.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
            raise "No French Misc Words with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_words.empty?
            words += new_tagged_words
          end
        end
        word = tagged_words.sample
        words.reject! { |v| v == word }
      else
        word = words.pop
      end
      word
    end

    def get_city(quiz_question, words)
      if quiz_question.tag_id
        tagged_words = []
        until !tagged_words.empty? do
          tagged_words = words.select { |word| word.tags.map(&:id).include?(quiz_question.tag_id) }
          if tagged_words.empty?
            new_tagged_words = FrenchCity.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
            raise "No French Cities with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_words.empty?
            words += new_tagged_words
          end
        end
        word = tagged_words.sample
        words.reject! { |v| v == word }
      else
        word = words.pop
      end
      word
    end

    def get_country(quiz_question, words)
      if quiz_question.tag_id
        tagged_words = []
        until !tagged_words.empty? do
          tagged_words = words.select { |word| word.tags.map(&:id).include?(quiz_question.tag_id) }
          if tagged_words.empty?
            new_tagged_words = FrenchCountry.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
            raise "No French Countries with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_words.empty?
            words += new_tagged_words
          end
        end
        word = tagged_words.sample
        words.reject! { |v| v == word }
      else
        word = words.pop
      end
      word
    end

    def display_plural_with_notification(args)
      noun = args[:noun]
      english_single_plural_same = (noun.english == noun.english_plural)
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
end
