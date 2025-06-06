json.frenchAdjective do
  json.id @french_adjective.id
  json.english @french_adjective.english
  json.masculine @french_adjective.masculine
  json.feminine @french_adjective.feminine
  json.masculinePlural @french_adjective.masculine_plural
  json.femininePlural @french_adjective.feminine_plural
  json.streak @french_adjective.streak
  json.streakFreezeExpiration @french_adjective.streak_freeze_expiration.to_i || ''
  json.url @french_adjective.url
  json.note @french_adjective.note
end
json.frenchAdjectiveTags @french_adjective_tags do |french_adjective_tag|
  json.id french_adjective_tag.id
  json.tagName french_adjective_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
