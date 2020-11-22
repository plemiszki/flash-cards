json.spanishMisc do
  json.id @spanish_misc.id
  json.english @spanish_misc.english
  json.spanish @spanish_misc.spanish
end
json.spanishMiscTags @spanish_misc_tags do |spanish_misc_tag|
  json.id spanish_misc_tag.id
  json.tagName spanish_misc_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
