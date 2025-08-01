json.key_format! camelize: :lower
json.deep_format_keys!

json.card do
  json.id @card.id
  json.question @card.question
  json.answer @card.answer
  json.answerPlaceholder @card.answer_placeholder
  json.imageUrl @card.image_url
  json.cloudinaryUrl @card.cloudinary_url
  json.multipleChoice @card.multiple_choice
  json.hint @card.hint
  json.config @card.config
  json.streak @card.streak
  json.streakFreezeExpiration @card.streak_freeze_expiration.to_i || ''
  json.notes @card.notes
end
json.cardTags @card_tags do |card_tag|
  json.id card_tag.id
  json.tagName card_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
json.matchBins @match_bins do |match_bin|
  json.id match_bin.id
  json.name match_bin.name
  json.matchItems match_bin.match_items do |match_item|
    json.id match_item.id
    json.name match_item.name
  end
end
