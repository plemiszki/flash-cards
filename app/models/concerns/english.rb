module English

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
