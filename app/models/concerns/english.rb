module English

  class << self

    def vowel?(input)
      input.downcase.in?('aeiou'.split(''))
    end

    def get_random_weekday
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].sample
    end

    def get_random_english_subject(plural_only: false, override: nil)
      return override if override
      ['we', 'they', 'these', 'those', 'I', 'you', 'he', 'she', 'it', 'this', 'that'][plural_only ? rand(4) : rand(11)]
    end

    def get_random_single_english_subject
      ['I', 'you', 'he', 'she', 'it', 'this', 'that'].sample
    end

    def get_random_plural_english_subject
      English::get_random_english_subject(plural_only: true)
    end

    def conjugate_be(subject:)
      case subject.capitalize
      when 'I'
        'am'
      when 'You', 'We', 'They'
        'are'
      when 'He', 'She'
        'is'
      else
        raise "Can't conjugate 'to be' with #{subject}"
      end
    end

    def subject_pronoun(spanish_pronoun: nil)
      result = {}
      case spanish_pronoun
      when 'yo'
        result[:pronoun] = 'I'
      when 'tú'
        result[:pronoun] = 'you'
        result[:format] = false
      when 'usted'
        result[:pronoun] = 'you'
        result[:formal] = true
      when 'él'
        result[:pronoun] = 'he'
      when 'ella'
        result[:pronoun] = 'she'
      when 'nosotros'
        result[:pronoun] = 'we'
      when 'nosotras'
        result[:pronoun] = 'we'
        result[:female_only] = true
      when 'ellos'
        result[:pronoun] = 'they'
      when 'ellas'
        result[:pronoun] = 'they'
        result[:female_only] = true
      end
      result
    end

    def convert_unusable_subjects_for_posession_conversion(input)
      subject = input.downcase
      case subject
      when 'this', 'that'
        'it'
      when 'these', 'those'
        'they'
      else
        input
      end
    end

    def get_plural_from_subject(subject)
      if subject.downcase.in?(['we', 'these', 'those'])
        use_plural = true
      elsif subject.downcase == 'they'
        use_plural = [true, false].sample
        notification = " (#{use_plural ? 'P' : 'S'})"
      else
        use_plural = false
      end
      return [use_plural, notification || ""]
    end

    def get_gender_from_subject(subject)
      if subject.downcase.in?(['i', 'he'])
        gender = :male
      elsif subject.downcase == 'she'
        gender = :female
      else
        gender = [:male, :female].sample
        notification = " (#{gender.to_s.capitalize[0]})"
      end
      return [gender, notification || ""]
    end

    def get_gender_and_plural_from_subject(subject, ignore_subject_gender: false)
      unless ignore_subject_gender
        if subject.downcase.in?(['i', 'he'])
          gender = :male
        elsif subject.downcase == 'she'
          gender = :female
        else
          gender = [:male, :female].sample
          notification = " (#{gender.to_s.capitalize[0]})"
        end
      end
      if subject.downcase.in?(['we', 'these', 'those'])
        use_plural = true
      elsif subject.downcase == 'they'
        use_plural = [true, false].sample
        use_plural_symbol = (use_plural ? 'P' : 'S')
        if notification
          notification.insert(-2, use_plural_symbol)
        else
          notification = " (#{use_plural_symbol})"
        end
      else
        use_plural = false
      end
      return [gender, use_plural, notification || ""]
    end

    def convert_subject_to_object(input)
      obj = {
        i: 'me',
        you: 'you',
        he: 'him',
        she: 'her',
        it: 'it',
        we: 'us',
        they: 'them',
        this: 'this',
        that: 'that',
        these: 'these',
        those: 'those'
      }
      subject = input.downcase.to_sym
      raise "invalid english subject (#{input}) for conversion to object" unless obj.key?(subject)
      obj[subject]
    end

    def get_possessive_from_subject(input)
      obj = {
        i: 'my',
        you: 'your',
        he: 'his',
        she: 'her',
        it: 'its',
        we: 'our',
        they: 'their'
      }
      subject = input.downcase.to_sym
      raise "invalid english subject (#{input}) for conversion to possessive" unless obj.key?(subject)
      obj[subject]
    end

    def possession(input)
      if input.ends_with?('s')
        "#{input}'"
      else
        "#{input}'s"
      end
    end

  end

end
