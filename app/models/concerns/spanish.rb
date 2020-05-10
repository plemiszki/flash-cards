module Spanish

  WEEKDAYS = [
    { spanish: 'lunes',
      english: 'Monday'
    },
    { spanish: 'martes',
      english: 'Tuesday'
    },
    { spanish: 'miércoles',
      english: 'Wednesday'
    },
    { spanish: 'jueves',
      english: 'Thursday'
    },
    { spanish: 'viernes',
      english: 'Friday'
    },
    { spanish: 'sábado',
      english: 'Saturday'
    },
    { spanish: 'domingo',
      english: 'Sunday'
    }
  ]

  def self.get_weekday(english)
    WEEKDAYS.detect { |weekday| weekday[:english] == english }
  end

  def self.conjugate_ser(subject: nil, noun: nil, use_plural: false)
    if subject
      case subject
      when 'yo'
        'soy'
      when 'tú'
        'eres'
      when 'usted', 'él', 'ella', 'esto', 'esta', 'este', 'eso', 'esa', 'ese'
        'es'
      when 'vosotros', 'vosotras'
        'sois'
      when 'nosotros', 'nosotras'
        'somos'
      when 'ellos', 'ellas', 'ustedes', 'estos', 'estas', 'esos', 'esas'
        'son'
      end
    elsif noun
      if use_plural
        'son'
      else
        'es'
      end
    else
      raise "conjugate ser is missing subject or noun"
    end
  end

  def self.get_noun(quiz_question, nouns)
    if quiz_question.tag_id
      tagged_nouns = []
      until !tagged_nouns.empty? do
        tagged_nouns = nouns.select { |noun| noun.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_nouns.empty?
          new_tagged_nouns = SpanishNoun.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
          raise "No Spanish Nouns with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_nouns.empty?
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

  def self.get_verb(quiz_question, verbs)
    if quiz_question.tag_id
      tagged_verbs = []
      until !tagged_verbs.empty? do
        tagged_verbs = verbs.select { |verb| verb.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_verbs.empty?
          new_tagged_verbs = SpanishVerb.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
          raise "No Spanish Verbs with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_verbs.empty?
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

  def self.get_adjective(quiz_question, adjectives)
    if quiz_question.tag_id
      tagged_adjectives = []
      until !tagged_adjectives.empty? do
        tagged_adjectives = adjectives.select { |adjective| adjective.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_adjectives.empty?
          new_tagged_adjectives = SpanishAdjective.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
          raise "No Spanish Adjectives with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_adjectives.empty?
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

  def self.get_subject_object(english_subject:, use_plural: false, gender:, formal: true, region: 'latin america')
    gender = (gender.in?(['male', :male]) ? 'male' : 'female')
    case english_subject.downcase
    when 'i'
      obj = {
        english: 'I',
        english_be: 'am',
        spanish: 'yo'
      }
      obj
    when 'you'
      obj = {
        english: 'you',
        english_be: 'are'
      }
      if use_plural
        if region == 'europe' && formal == false
          obj[:spanish] = (gender == 'male' ? 'vosotros' : 'vosotras')
        else
          obj[:spanish] = 'ustedes'
        end
      else
        obj[:spanish] = (formal ? 'usted' : 'tú')
      end
      obj
    when 'he'
      obj = {
        english: 'he',
        english_be: 'is',
        spanish: 'él'
      }
    when 'she'
      obj = {
        english: 'she',
        english_be: 'is',
        spanish: 'ella'
      }
    when 'it'
      obj = {
        english: 'it',
        english_be: 'is'
      }
      obj[:spanish] = (gender == 'male' ? 'él' : 'ella')
    when 'we'
      obj = {
        english: 'we',
        english_be: 'are'
      }
      obj[:spanish] = (gender == 'male' ? 'nosotros' : 'nosotras')
    when 'they'
      obj = {
        english: 'they',
        english_be: 'are'
      }
      if use_plural
        obj[:spanish] = (gender == 'male' ? 'ellos' : 'ellas')
      else
        obj[:spanish] = (gender == 'male' ? 'él' : 'ella')
      end
    when 'this'
      obj = {
        english: 'this',
        english_be: 'is'
      }
      obj[:spanish] = (gender == 'male' ? 'esto' : 'esta')
    when 'that'
      obj = {
        english: 'that',
        english_be: 'is'
      }
      obj[:spanish] = (gender == 'male' ? 'eso' : 'esa')
    when 'these'
      obj = {
        english: 'these',
        english_be: 'are'
      }
      obj[:spanish] = (gender == 'male' ? 'estos' : 'estas')
    when 'those'
      obj = {
        english: 'those',
        english_be: 'are'
      }
      obj[:spanish] = (gender == 'male' ? 'esos' : 'esas')
    end
    obj
  end

end
