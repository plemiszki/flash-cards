module English

  def self.get_random_english_subject(plural_only: false)
    ['we', 'they', 'these', 'those', 'I', 'you', 'he', 'she', 'it', 'this', 'that'][plural_only ? rand(4) : rand(11)]
  end

  def self.get_random_single_english_subject
    ['I', 'you', 'he', 'she', 'it', 'this', 'that'].sample
  end

  def self.get_random_plural_english_subject
    English::get_random_english_subject(plural_only: true)
  end

  def self.convert_unusable_subjects_for_posession_conversion(input)
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

  def self.get_plural_from_subject(subject)
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

  def self.get_gender_from_subject(subject)
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

  def self.get_gender_and_plural_from_subject(subject)
    if subject.downcase.in?(['i', 'he'])
      gender = :male
    elsif subject.downcase == 'she'
      gender = :female
    else
      gender = [:male, :female].sample
      notification = " (#{gender.to_s.capitalize[0]})"
    end
    if subject.downcase.in?(['we', 'these', 'those'])
      use_plural = true
    elsif subject.downcase == 'they'
      use_plural = [true, false].sample
      notification.insert(-2, use_plural ? 'P' : 'S')
    else
      use_plural = false
    end
    return [gender, use_plural, notification || ""]
  end

  def self.convert_subject_to_object(input)
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

  def self.get_possessive_from_subject(input)
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

  def self.possession(input)
    if input.ends_with?('s')
      "#{input}'"
    else
      "#{input}'s"
    end
  end

end
