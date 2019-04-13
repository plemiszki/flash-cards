json.cardTags @card_tags do |card_tag|
  json.id card_tag.id
  json.tagName card_tag.tag.name
end
