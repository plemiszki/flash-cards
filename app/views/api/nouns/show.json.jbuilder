json.entity do
  json.id @noun.id
  json.english @noun.english
  json.englishPlural @noun.english_plural
  json.foreign @noun.foreign
  json.foreignPlural @noun.foreign_plural
  json.transliterated @noun.transliterated || ''
  json.transliteratedPlural @noun.transliterated_plural || ''
  json.gender @noun.gender.to_s
end
json.array1 @noun_tags do |noun_tag|
  json.id noun_tag.id
  json.tagName noun_tag.tag.name
end
json.array2 @tags do |tag|
  json.id tag.id
  json.name tag.name
end
