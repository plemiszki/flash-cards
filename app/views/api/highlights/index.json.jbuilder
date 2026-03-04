json.highlights @highlights do |highlight|
  json.id highlight.id
  json.highlightableId highlight.highlightable_id
  json.highlightableType highlight.highlightable_type
  e = highlight.highlightable
  case @entity_type
  when 'Card'
    json.question e.question
    json.tags e.tags.pluck(:name).sort.join(', ')
    json.streak e.streak
  when 'FrenchNoun'
    json.french e.french
    json.english e.english
    json.gender e.male? ? 'Male' : 'Female'
    json.streak e.streak
  when 'FrenchVerb'
    json.french e.french
    json.english e.english
    json.streak e.streak
  when 'FrenchAdjective'
    json.masculine e.masculine
    json.english e.english
    json.streak e.streak
  when 'FrenchMisc', 'FrenchCity'
    json.french e.french
    json.english e.english
    json.streak e.streak
  when 'FrenchCountry'
    json.french e.french
    json.english e.english
    json.gender e.male? ? 'Male' : 'Female'
    json.streak e.streak
  when 'SpanishNoun'
    json.spanish e.spanish
    json.english e.english
    json.streak e.streak
  when 'SpanishVerb'
    json.spanish e.spanish
    json.english e.english
    json.streak e.streak
    json.forms e.forms.present? ? 'Yes' : 'No'
  when 'SpanishAdjective'
    json.masculine e.masculine
    json.english e.english
    json.streak e.streak
  when 'SpanishMisc'
    json.spanish e.spanish
    json.english e.english
  end
end
