module Hindi

  def self.conjugate_ka(args)
    if args[:transliterated]
      noun = args[:transliterated]
      noun.gender == 1 ? (args[:use_plural] ? 'ke' : 'ka') : 'ki'
    elsif args[:hindi]
      noun = args[:hindi]
      noun.gender == 1 ? (args[:use_plural] ? 'के' : 'का') : 'की'
    end
  end

  def self.possession(input)
    if input.ends_with?('s')
      "#{input}'"
    else
      "#{input}'s"
    end
  end

end
