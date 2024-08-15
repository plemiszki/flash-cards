json.frenchNoun do
  json.id @french_noun.id
  json.english @french_noun.english
  json.englishPlural @french_noun.english_plural
  json.french @french_noun.french
  json.frenchPlural @french_noun.french_plural
  json.gender @french_noun.gender.to_s
  json.note @french_noun.note
  json.streak @french_noun.streak
  json.streakFreezeExpiration @french_noun.streak_freeze_expiration.to_i || ''
  json.url @french_noun.url
  json.uncountable @french_noun.uncountable
end
json.frenchNounTags @french_noun_tags do |french_noun_tag|
  json.id french_noun_tag.id
  json.tagName french_noun_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
