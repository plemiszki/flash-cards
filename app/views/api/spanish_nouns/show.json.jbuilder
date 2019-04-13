json.spanishNoun do
  json.id @spanish_noun.id
  json.english @spanish_noun.english
  json.englishPlural @spanish_noun.english_plural
  json.spanish @spanish_noun.spanish
  json.spanishPlural @spanish_noun.spanish_plural
  json.gender @spanish_noun.gender.to_s
end
