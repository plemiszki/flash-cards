json.frenchVerbs @french_verbs do |french_verb|
  json.id french_verb.id
  json.french french_verb.french
  json.english french_verb.english
  json.streak french_verb.streak
  json.forms french_verb.forms.present? ? 'Yes' : 'No'
end
