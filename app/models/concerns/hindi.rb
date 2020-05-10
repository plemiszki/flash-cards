module Hindi

  WEEKDAYS = [
    { hindi: 'रविवार',
      transliterated: 'ravivar',
      english: 'Sunday'
    },
    { hindi: 'सोमवार',
      transliterated: 'somvar',
      english: 'Monday'
    },
    { hindi: 'मंगलवार',
      transliterated: 'mangalvar',
      english: 'Tuesday'
    },
    { hindi: 'बुधवार',
      transliterated: 'budhvar',
      english: 'Wednesday'
    },
    { hindi: 'गुरुवार',
      transliterated: 'guruvar',
      english: 'Thursday'
    },
    { hindi: 'शुक्रवार',
      transliterated: 'shukravar',
      english: 'Friday'
    },
    { hindi: 'शुक्रवार',
      transliterated: 'shanivar',
      english: 'Saturday'
    }
  ]

  def self.get_weekday(english)
    WEEKDAYS.detect { |weekday| weekday[:english] == english }
  end

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
          new_tagged_adjectives = Adjective.includes(:tags).where(tags: { id: Tag.find(quiz_question.tag_id) })
          raise "No Hindi Adjectives with Tag: #{Tag.find(quiz_question.tag_id).name}" if new_tagged_adjectives.empty?
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

  def self.get_subject_has_objects_using_ka(subject_objects:, gender:, plural:)
    transliterated_ending = (gender == 'male' ? (plural ? 'e' : 'a') : 'i')
    hindi_ending = (gender == 'male' ? (plural ? 'े' : 'ा') : 'ी')
    subject_objects.map do |subject_object|
      case subject_object[:english]
      when 'I'
        {
          english: 'I have',
          transliterated: "mer#{transliterated_ending}",
          hindi: "मेर#{hindi_ending}"
        }
      when 'you'
        {
          english: 'you have',
          transliterated: "apk#{transliterated_ending}",
          hindi: "आपक#{hindi_ending}"
        }
      when 'he', 'she', 'it'
        {
          english: "#{subject_object[:english]} has",
          transliterated: (subject_object[:hindi] == 'यह' ? "usk#{transliterated_ending}" : "isk#{transliterated_ending}"),
          hindi: (subject_object[:hindi] == 'यह' ? "उसक#{hindi_ending}" : "इसक#{hindi_ending}")
        }
      when 'this'
        {
          english: 'this has',
          transliterated: "isk#{transliterated_ending}",
          hindi: "इसक#{hindi_ending}"
        }
      when 'that'
        {
          english: 'that has',
          transliterated: "usk#{transliterated_ending}",
          hindi: "उसक#{hindi_ending}"
        }
      when 'we'
        {
          english: 'we have',
          transliterated: "hamar#{transliterated_ending}",
          hindi: "हमार#{hindi_ending}"
        }
      when 'they'
        case subject_object[:hindi]
        when 'यह'
          {
            english: 'they have',
            transliterated: "isk#{transliterated_ending}",
            hindi: "इसक#{hindi_ending}"
          }
        when 'ये'
          {
            english: 'they have',
            transliterated: "ink#{transliterated_ending}",
            hindi: "इनक#{hindi_ending}"
          }
        when 'वह'
          {
            english: 'they have',
            transliterated: "usk#{transliterated_ending}",
            hindi: "उसक#{hindi_ending}"
          }
        when 'वे'
          {
            english: 'they have',
            transliterated: "unk#{transliterated_ending}",
            hindi: "उनक#{hindi_ending}"
          }
        end
      when 'these'
        {
          english: 'these have',
          transliterated: "ink#{transliterated_ending}",
          hindi: "इनक#{hindi_ending}"
        }
      when 'those'
        {
          english: 'those have',
          transliterated: "unk#{transliterated_ending}",
          hindi: "उनक#{hindi_ending}"
        }
      end
    end
  end

  def self.get_subject_has_objects(subject_objects)
    subject_objects.map do |subject_object|
      case subject_object[:english]
      when 'I'
        {
          english: 'I have',
          transliterated: 'mere pas',
          hindi: 'मेरे पास'
        }
      when 'you'
        {
          english: 'you have',
          transliterated: (subject_object[:hindi] == 'तुम' ? 'tumhare pas' : 'apke pas'),
          hindi: (subject_object[:hindi] == 'तुम' ? 'तुम्हारे पास' : 'आपके पास')
        }
      when 'he', 'she', 'it'
        {
          english: 'he has',
          transliterated: (subject_object[:hindi] == 'यह' ? 'uske pas' : 'iske pas'),
          hindi: (subject_object[:hindi] == 'यह' ? 'उसके पास' : 'इसके पस')
        }
      when 'this'
        {
          english: 'this has',
          transliterated: 'iske pas',
          hindi: 'इसके पास'
        }
      when 'that'
        {
          english: 'that has',
          transliterated: 'uske pas',
          hindi: 'उसके पास'
        }
      when 'we'
        {
          english: 'we have',
          transliterated: 'hamare pas',
          hindi: 'हमारे पास'
        }
      when 'they'
        case subject_object[:hindi]
        when 'यह'
          {
            english: 'they have',
            transliterated: 'iske pas',
            hindi: 'इसके पास'
          }
        when 'ये'
          {
            english: 'they have',
            transliterated: 'inke pas',
            hindi: 'इनके पास'
          }
        when 'वह'
          {
            english: 'they have',
            transliterated: 'uske pas',
            hindi: 'उसके पास'
          }
        when 'वे'
          {
            english: 'they have',
            transliterated: 'unke pas',
            hindi: 'उनके पास'
          }
        end
      when 'these'
        {
          english: 'these have',
          transliterated: 'inke pas',
          hindi: 'इनके पास'
        }
      when 'those'
        {
          english: 'those have',
          transliterated: 'unke pas',
          hindi: 'उनके पास'
        }
      end
    end
  end

  def self.get_subject_objects(english_subject:, use_plural: false, gender: :male)
    case english_subject.downcase
    when 'i'
      [{
        english: 'I',
        english_be: 'am',
        english_be_past: 'was',
        hindi: 'मैं',
        hindi_be: 'हूँ',
        hindi_be_past: 'था',
        transliterated: 'mai',
        transliterated_be: 'hu',
        transliterated_be_past: 'tha'
      }]
    when 'you'
      [
        {
          english: 'you',
          english_be: 'are',
          english_be_past: 'were',
          hindi: 'तुम',
          hindi_be: 'हो',
          hindi_be_past: (gender == :male ? (use_plural ? 'थे' : 'था') : 'थी'),
          transliterated: 'tum',
          transliterated_be: 'ho',
          transliterated_be_past: (gender == :male ? (use_plural ? 'the' : 'tha') : 'thi')
        },
        {
          english: 'you',
          english_be: 'are',
          english_be_past: 'were',
          hindi: 'आप',
          hindi_be: 'हैं',
          hindi_be_past: (gender == :male ? 'थे' : 'थी'),
          transliterated: 'ap',
          transliterated_be: 'hai',
          transliterated_be_past: (gender == :male ? 'the' : 'thi')
        }
      ]
    when 'he'
      [
        {
          english: 'he',
          english_be: 'is',
          english_be_past: 'was',
          hindi: 'यह',
          hindi_be: 'है',
          hindi_be_past: 'था',
          transliterated: 'yah',
          transliterated_be: 'hai',
          transliterated_be_past: 'tha'
        },
        {
          english: 'he',
          english_be: 'is',
          english_be_past: 'was',
          hindi: 'वह',
          hindi_be: 'है',
          hindi_be_past: 'था',
          transliterated: 'vah',
          transliterated_be: 'hai',
          transliterated_be_past: 'tha'
        }
      ]
    when 'she'
      [
        {
          english: 'she',
          english_be: 'is',
          english_be_past: 'was',
          hindi: 'यह',
          hindi_be: 'है',
          hindi_be_past: 'थी',
          transliterated: 'yah',
          transliterated_be: 'hai',
          transliterated_be_past: 'thi'
        },
        {
          english: 'she',
          english_be: 'is',
          english_be_past: 'was',
          hindi: 'वह',
          hindi_be: 'है',
          hindi_be_past: 'थी',
          transliterated: 'vah',
          transliterated_be: 'hai',
          transliterated_be_past: 'thi'
        }
      ]
    when 'it'
      [
        {
          english: 'it',
          english_be: 'is',
          english_be_past: 'was',
          hindi: 'यह',
          hindi_be: 'है',
          hindi_be_past: (gender == :male ? 'था' : 'थी'),
          transliterated: 'yah',
          transliterated_be: 'hai',
          transliterated_be_past: (gender == :male ? 'tha' : 'thi')
        },
        {
          english: 'it',
          english_be: 'is',
          english_be_past: 'was',
          hindi: 'वह',
          hindi_be: 'है',
          hindi_be_past: (gender == :male ? 'था' : 'थी'),
          transliterated: 'vah',
          transliterated_be: 'hai',
          transliterated_be_past: (gender == :male ? 'tha' : 'thi')
        }
      ]
    when 'we'
      [
        {
          english: 'we',
          english_be: 'are',
          english_be_past: 'were',
          hindi: 'हम',
          hindi_be: 'हैं',
          hindi_be_past: (gender == :male ? 'थे' : 'थी'),
          transliterated: 'ham',
          transliterated_be: 'hai',
          transliterated_be_past: (gender == :male ? 'the' : 'thi')
        }
      ]
    when 'this'
      [
        {
          english: 'this',
          english_be: 'is',
          english_be_past: 'was',
          hindi: 'यह',
          hindi_be: 'है',
          hindi_be_past: (gender == :male ? 'था' : 'थी'),
          transliterated: 'yah',
          transliterated_be: 'hai',
          transliterated_be_past: (gender == :male ? 'tha' : 'thi')
        }
      ]
    when 'that'
      [
        {
          english: 'that',
          english_be: 'is',
          english_be_past: 'was',
          hindi: 'वह',
          hindi_be: 'है',
          hindi_be_past: (gender == :male ? 'था' : 'थी'),
          transliterated: 'vah',
          transliterated_be: 'hai',
          transliterated_be_past: (gender == :male ? 'tha' : 'thi')
        }
      ]
    when 'they'
      if use_plural
        [
          {
            english: 'they',
            english_be: 'are',
            english_be_past: 'were',
            hindi: 'ये',
            hindi_be: 'हैं',
            hindi_be_past: (gender == :male ? 'थे' : 'थी'),
            transliterated: 'ye',
            transliterated_be: 'hai',
            transliterated_be_past: (gender == :male ? 'the' : 'thi')
          },
          {
            english: 'they',
            english_be: 'are',
            english_be_past: 'were',
            hindi: 'वे',
            hindi_be: 'हैं',
            hindi_be_past: (gender == :male ? 'थे' : 'थी'),
            transliterated: 've',
            transliterated_be: 'hai',
            transliterated_be_past: (gender == :male ? 'the' : 'thi')
          }
        ]
      else
        [
          {
            english: 'they',
            english_be: 'are',
            english_be_past: 'were',
            hindi: 'यह',
            hindi_be: 'है',
            hindi_be_past: (gender == :male ? 'था' : 'थी'),
            transliterated: 'yah',
            transliterated_be: 'hai',
            transliterated_be_past: (gender == :male ? 'tha' : 'thi')
          },
          {
            english: 'they',
            english_be: 'are',
            english_be_past: 'were',
            hindi: 'वह',
            hindi_be: 'है',
            hindi_be_past: (gender == :male ? 'था' : 'थी'),
            transliterated: 'vah',
            transliterated_be: 'hai',
            transliterated_be_past: (gender == :male ? 'tha' : 'thi')
          }
        ]
      end
    when 'these'
      [
        {
          english: 'these',
          english_be: 'are',
          english_be_past: 'were',
          hindi: 'ये',
          hindi_be: 'हैं',
          hindi_be_past: (gender == :male ? 'थे' : 'थी'),
          transliterated: 'ye',
          transliterated_be: 'hai',
          transliterated_be_past: (gender == :male ? 'the' : 'thi')
        }
      ]
    when 'those'
      [
        {
          english: 'those',
          english_be: 'are',
          english_be_past: 'were',
          hindi: 'वे',
          hindi_be: 'हैं',
          hindi_be_past: (gender == :male ? 'थे' : 'थी'),
          transliterated: 've',
          transliterated_be: 'hai',
          transliterated_be_past: (gender == :male ? 'the' : 'thi')
        }
      ]
    end
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

  def self.obliqify_subject(transliterated_subject)
    case transliterated_subject
    when 'mai'
      { hindi: 'मुझको', transliterated: 'mujhko' }
    when 'tum'
      { hindi: 'तुझको', transliterated: 'tumko' }
    when 'ap'
      { hindi: 'आपको', transliterated: 'apko' }
    when 'ham'
      { hindi: 'हमको', transliterated: 'hamko' }
    when 'yah'
      { hindi: 'इसको', transliterated: 'isko' }
    when 'ye'
      { hindi: 'इनको', transliterated: 'inko' }
    when 'vah'
      { hindi: 'उसको', transliterated: 'usko' }
    when 've'
      { hindi: 'उनको', transliterated: 'unko' }
    end
  end

end
