module English

  def self.possession(input)
    if input.ends_with?('s')
      "#{input}'"
    else
      "#{input}'s"
    end
  end

end
