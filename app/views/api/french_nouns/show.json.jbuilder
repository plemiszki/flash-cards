json.frenchNoun do
  json.id @french_noun.id
  json.english @french_noun.english
  json.englishPlural @french_noun.english_plural
  json.french @french_noun.french
  json.frenchPlural @french_noun.french_plural
  json.gender @french_noun.gender.to_s
  json.note @french_noun.note
  json.lastStreakAdd @french_noun.last_streak_add
  json.streak @french_noun.streak
  json.streakFreezeExpiration @french_noun.streak_freeze_expiration.to_i || ''
end
json.frenchNounTags @french_noun_tags do |french_noun_tag|
  json.id french_noun_tag.id
  json.tagName french_noun_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
