json.entities @cards do |card|
  json.id card.id
  json.question card.question
  json.tags card.tags.pluck(:name).join(', ')
end
