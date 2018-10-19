json.entity do
  json.id @card.id
  json.question @card.question
  json.answer @card.answer
end
json.array1 @card_tags do |card_tag|
  json.id card_tag.id
  json.tagName card_tag.tag.name
end
json.array2 @tags do |tag|
  json.id tag.id
  json.name tag.name
end
