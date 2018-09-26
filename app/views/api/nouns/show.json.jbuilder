json.noun do
  json.id @noun.id
  json.english @noun.english
  json.englishPlural @noun.english_plural
  json.foreign @noun.foreign
  json.foreignPlural @noun.foreign_plural
  json.transliterated @noun.transliterated
  json.transliteratedPlural @noun.transliterated_plural
  json.gender @noun.gender.to_s
end
