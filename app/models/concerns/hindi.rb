module Hindi

  def self.conjugate_ka(args)
    gender = args[:noun] ? [:male, :female][args[:noun].gender - 1] : args[:gender]
    if args[:output] == 'transliterated'
      gender == :male ? (args[:use_plural] ? 'ke' : 'ka') : 'ki'
    elsif args[:output] == 'hindi'
      gender == :male ? (args[:use_plural] ? 'के' : 'का') : 'की'
    end
  end

  def self.conjugate_sakna(args)
    if args[:output] == 'transliterated'
      args[:gender] == :male ? (args[:use_plural] ? 'sakte' : 'sakta') : 'sakti'
    elsif args[:output] == 'hindi'
      args[:gender] == :male ? (args[:use_plural] ? 'सकते' : 'सकता') : 'सकती'
    end
  end

  def self.convert_number(n)
    [
      { hindi: "शून्य", transliterated: "shuniye" },
      { hindi: "एक", transliterated: "ek" },
      { hindi: "दो", transliterated: "do" },
      { hindi: "तीन", transliterated: "teen" },
      { hindi: "चार", transliterated: "char" },
      { hindi: "पांच", transliterated: "panch" },
      { hindi: "छह", transliterated: "che" },
      { hindi: "सात", transliterated: "saat" },
      { hindi: "आठ", transliterated: "aath" },
      { hindi: "नौ", transliterated: "nau" },
      { hindi: "दस", transliterated: "das" },
      { hindi: "ग्यारह", transliterated: "gyara" },
      { hindi: "बारह", transliterated: "bara" },
      { hindi: "तेरह", transliterated: "tera" },
      { hindi: "चौदह", transliterated: "chauda" },
      { hindi: "पंद्रह", transliterated: "pandra" },
      { hindi: "सोलह", transliterated: "sola" },
      { hindi: "सत्रह", transliterated: "satra" },
      { hindi: "अठारह", transliterated: "aathara" },
      { hindi: "उन्नीस", transliterated: "unnis" },
      { hindi: "बीस", transliterated: "bees" }
    ][n]
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

  def self.get_possession_objects(english_subject, use_plural)
    case english_subject.downcase
    when 'i'
      [{
        hindi_masculine_singular: 'मेरा',
        hindi_masculine_plural: 'मेरे',
        hindi_feminine: 'मेरी',
        transliterated_masculine_singular: 'mera',
        transliterated_masculine_plural: 'mere',
        transliterated_feminine: 'meri'
      }]
    when 'you'
      [
        {
          hindi_masculine_singular: 'तुम्हारा',
          hindi_masculine_plural: 'तुम्हारे',
          hindi_feminine: 'तुम्हारी',
          transliterated_masculine_singular: 'tumhara',
          transliterated_masculine_plural: 'tumhare',
          transliterated_feminine: 'tumhari'
        },
        {
          hindi_masculine_singular: 'आपका',
          hindi_masculine_plural: 'आपके',
          hindi_feminine: 'आपकी',
          transliterated_masculine_singular: 'apka',
          transliterated_masculine_plural: 'apke',
          transliterated_feminine: 'apki'
        }
      ]
    when 'he', 'she', 'it'
      [
        {
          hindi_masculine_singular: 'इसका',
          hindi_masculine_plural: 'इसके',
          hindi_feminine: 'इसकी',
          transliterated_masculine_singular: 'iska',
          transliterated_masculine_plural: 'iske',
          transliterated_feminine: 'iski'
        },
        {
          hindi_masculine_singular: 'उसका',
          hindi_masculine_plural: 'उसके',
          hindi_feminine: 'उसकी',
          transliterated_masculine_singular: 'uska',
          transliterated_masculine_plural: 'uske',
          transliterated_feminine: 'uski'
        }
      ]
    when 'we'
      [{
        hindi_masculine_singular: 'हमारा',
        hindi_masculine_plural: 'हमारे',
        hindi_feminine: 'हमारी',
        transliterated_masculine_singular: 'hamara',
        transliterated_masculine_plural: 'hamare',
        transliterated_feminine: 'hamari'
      }]
    when 'this'
      [{
        hindi_masculine_singular: 'इसका',
        hindi_masculine_plural: 'इसके',
        hindi_feminine: 'इसकी',
        transliterated_masculine_singular: 'iska',
        transliterated_masculine_plural: 'iske',
        transliterated_feminine: 'iski'
      }]
    when 'that'
      [{
        hindi_masculine_singular: 'उसका',
        hindi_masculine_plural: 'उसके',
        hindi_feminine: 'उसकी',
        transliterated_masculine_singular: 'uska',
        transliterated_masculine_plural: 'uske',
        transliterated_feminine: 'uski'
      }]
    when 'they'
      if use_plural
        [
          {
            hindi_masculine_singular: 'इनका',
            hindi_masculine_plural: 'इनके',
            hindi_feminine: 'इनकी',
            transliterated_masculine_singular: 'inka',
            transliterated_masculine_plural: 'inke',
            transliterated_feminine: 'inki'
          },
          {
            hindi_masculine_singular: 'उनका',
            hindi_masculine_plural: 'उनके',
            hindi_feminine: 'उनकी',
            transliterated_masculine_singular: 'unka',
            transliterated_masculine_plural: 'unke',
            transliterated_feminine: 'unki'
          }
        ]
      else
        [
          {
            hindi_masculine_singular: 'इसका',
            hindi_masculine_plural: 'इसके',
            hindi_feminine: 'इसकी',
            transliterated_masculine_singular: 'iska',
            transliterated_masculine_plural: 'iske',
            transliterated_feminine: 'iski'
          },
          {
            hindi_masculine_singular: 'उसका',
            hindi_masculine_plural: 'उसके',
            hindi_feminine: 'उसकी',
            transliterated_masculine_singular: 'uska',
            transliterated_masculine_plural: 'uske',
            transliterated_feminine: 'uski'
          }
        ]
      end
    when 'these'
      [{
        hindi_masculine_singular: 'इनका',
        hindi_masculine_plural: 'इनके',
        hindi_feminine: 'इनकी',
        transliterated_masculine_singular: 'inka',
        transliterated_masculine_plural: 'inke',
        transliterated_feminine: 'inki'
      }]
    when 'those'
      [{
        hindi_masculine_singular: 'उनका',
        hindi_masculine_plural: 'उनके',
        hindi_feminine: 'उनकी',
        transliterated_masculine_singular: 'unka',
        transliterated_masculine_plural: 'unke',
        transliterated_feminine: 'unki'
      }]
    end
  end

  def self.obliqify(args)
    if args[:adjective_transliterated]
      # adjectives with masculine -a endings describing masculine singular oblique nouns change to -e (even if noun does not end in -a)
      adjective = args[:adjective_transliterated]
      noun = args[:noun_transliterated]
      if noun.male?
        if args[:use_plural] && noun.countable?
          adjective.transliterated_masculine_plural
        elsif adjective.transliterated_masculine[-1] == 'a'
          adjective.transliterated_masculine_plural
        else
          adjective.transliterated_masculine
        end
      else
        adjective.transliterated_feminine
      end
    elsif args[:adjective_hindi]
      # same logic as above
      adjective = args[:adjective_hindi]
      noun = args[:noun_hindi]
      if noun.male?
        if args[:use_plural] && noun.countable?
          adjective.masculine_plural
        elsif adjective.masculine[-1] == 'ा'
          adjective.masculine_plural
        else
          adjective.masculine
        end
      else
        adjective.feminine
      end
    else # nouns
      if args[:use_plural] && (args[:noun_transliterated].try(:uncountable) == false || args[:noun_hindi].try(:uncountable) == false)
        # nouns ending in -i change to -iyo
        # all other nouns change to -o in the oblique plural
        if args[:noun_transliterated]
          if args[:noun_transliterated].transliterated[-1] == 'i'
            "#{args[:noun_transliterated].transliterated[0...-1]}iyo"
          elsif args[:noun_transliterated].transliterated[-1] == 'o'
            "#{args[:noun_transliterated].transliterated}"
          else
            if args[:noun_transliterated].gender == 1 && args[:noun_transliterated].transliterated[-1] == 'a'
              "#{args[:noun_transliterated].transliterated[0...-1]}o"
            else
              "#{args[:noun_transliterated].transliterated}o"
            end
          end
        elsif args[:noun_hindi]
          if args[:noun_hindi].foreign[-1] == 'ी'
            "#{args[:noun_hindi].foreign[0...-1]}ियों"
          elsif ['ू', 'ो'].include?(args[:noun_hindi].foreign[-1])
            args[:noun_hindi].foreign
          else
            if args[:noun_hindi].foreign[-1] == 'ा'
              if args[:noun_hindi].gender == 1
                "#{args[:noun_hindi].foreign[0...-1]}ों"
              else
                "#{args[:noun_hindi].foreign}ओंं"
              end
            else
              "#{args[:noun_hindi].foreign}ों"
            end
          end
        end
      else
        # singluar nouns with masculine -a endings change to -e
        if args[:noun_transliterated]
          if args[:noun_transliterated].gender == 1 && args[:noun_transliterated].transliterated[-1] == 'a'
            "#{args[:noun_transliterated].transliterated[0...-1]}e"
          else
            args[:noun_transliterated].transliterated
          end
        elsif args[:noun_hindi]
          args[:noun_hindi]
          if args[:noun_hindi].gender == 1 && args[:noun_hindi].foreign[-1] == 'ा'
            "#{args[:noun_hindi].foreign[0...-1]}े"
          else
            args[:noun_hindi].foreign
          end
        end
      end
    end
  end

end
