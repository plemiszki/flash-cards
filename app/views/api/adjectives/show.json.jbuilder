json.adjective do
  json.id @adjective.id
  json.english @adjective.english
  json.masculine @adjective.masculine
  json.feminine @adjective.feminine
  json.masculinePlural @adjective.masculine_plural
  json.transliteratedMasculine @adjective.transliterated_masculine
  json.transliteratedFeminine @adjective.transliterated_feminine
  json.transliteratedMasculinePlural @adjective.transliterated_masculine_plural
end
json.adjectiveTags @adjective_tags do |adjective_tag|
  json.id adjective_tag.id
  json.tagName adjective_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
