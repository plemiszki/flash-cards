json.spanishVerb do
  json.id @spanish_verb.id
  json.english @spanish_verb.english
  json.spanish @spanish_verb.spanish
  json.note @spanish_verb.note
  json.forms @spanish_verb.forms
  json.streak @spanish_verb.streak
  json.streakFreezeExpiration @spanish_verb.streak_freeze_expiration.to_i || ''
end
json.spanishVerbTags @spanish_verb_tags do |spanish_verb_tag|
  json.id spanish_verb_tag.id
  json.tagName spanish_verb_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
