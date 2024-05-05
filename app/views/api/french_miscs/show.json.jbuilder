json.frenchMisc do
  json.id @french_misc.id
  json.english @french_misc.english
  json.french @french_misc.french
  json.streak @french_misc.streak
  json.streakFreezeExpiration @french_misc.streak_freeze_expiration.to_i || ''
  json.url @french_misc.url
  json.note @french_misc.note
end
json.frenchMiscTags @french_misc_tags do |french_misc_tag|
  json.id french_misc_tag.id
  json.tagName french_misc_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
