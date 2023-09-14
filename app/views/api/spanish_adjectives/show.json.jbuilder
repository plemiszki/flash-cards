json.spanishAdjective do
  json.id @spanish_adjective.id
  json.english @spanish_adjective.english
  json.masculine @spanish_adjective.masculine
  json.feminine @spanish_adjective.feminine
  json.masculinePlural @spanish_adjective.masculine_plural
  json.femininePlural @spanish_adjective.feminine_plural
  json.streak @spanish_adjective.streak
  json.streakFreezeExpiration @spanish_adjective.streak_freeze_expiration.to_i || ''
end
json.spanishAdjectiveTags @spanish_adjective_tags do |spanish_adjective_tag|
  json.id spanish_adjective_tag.id
  json.tagName spanish_adjective_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
