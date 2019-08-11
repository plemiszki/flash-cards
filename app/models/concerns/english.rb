module English

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

  def self.possession(input)
    if input.ends_with?('s')
      "#{input}'"
    else
      "#{input}'s"
    end
  end

end
