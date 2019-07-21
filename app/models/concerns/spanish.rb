module Spanish

  def self.get_noun(quiz_question, nouns)
    if quiz_question.tag_id
      tagged_nouns = []
      until !tagged_nouns.empty? do
        tagged_nouns = nouns.select { |noun| noun.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_nouns.empty?
          nouns += SpanishNoun.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
        end
      end
      noun = tagged_nouns.sample
      nouns.reject! { |n| n == noun }
    else
      noun = nouns.pop
    end
    noun
  end

  def self.get_verb(quiz_question, verbs)
    if quiz_question.tag_id
      tagged_verbs = []
      until !tagged_verbs.empty? do
        tagged_verbs = verbs.select { |verb| verb.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_verbs.empty?
          verbs += SpanishVerb.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
        end
      end
      verb = tagged_verbs.sample
      verbs.reject! { |v| v == verb }
    else
      verb = verbs.pop
    end
    verb
  end

  def self.display_plural_with_notification(args)
    noun = args[:noun]
    english_single_plural_same = (noun.english == noun.english_plural)
    spanish_single_plural_same = (noun.spanish == noun.spanish_plural)
    if args[:use_plural]
      if english_single_plural_same && !spanish_single_plural_same
        "#{args[:noun].english_plural} (plural)"
      else
        "#{args[:noun].english_plural}"
      end
    else
      args[:noun].english
    end
  end

end
