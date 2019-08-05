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

  def self.get_adjective(quiz_question, adjectives)
    if quiz_question.tag_id
      tagged_adjectives = []
      until !tagged_adjectives.empty? do
        tagged_adjectives = adjectives.select { |adjective| adjective.tags.map(&:id).include?(quiz_question.tag_id) }
        if tagged_adjectives.empty?
          adjectives += Adjective.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
        end
      end
      adjective = tagged_adjectives.sample
      adjectives.reject! { |v| v == adjective }
    else
      adjective = adjectives.pop
    end
    adjective
  end

  def self.possession(input)
    if input.ends_with?('s')
      "#{input}'"
    else
      "#{input}'s"
    end
  end

end
