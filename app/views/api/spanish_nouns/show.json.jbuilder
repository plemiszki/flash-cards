json.spanishNoun do
  json.id @spanish_noun.id
  json.english @spanish_noun.english
  json.englishPlural @spanish_noun.english_plural
  json.spanish @spanish_noun.spanish
  json.spanishPlural @spanish_noun.spanish_plural
  json.gender @spanish_noun.gender.to_s
  json.note @spanish_noun.note
end
json.spanishNounTags @spanish_noun_tags do |spanish_noun_tag|
  json.id spanish_noun_tag.id
  json.tagName spanish_noun_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
