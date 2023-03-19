json.frenchVerb do
  json.id @french_verb.id
  json.english @french_verb.english
  json.french @french_verb.french
  json.note @french_verb.note
  json.forms @french_verb.forms
end
json.frenchVerbTags @french_verb_tags do |french_verb_tag|
  json.id french_verb_tag.id
  json.tagName french_verb_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
