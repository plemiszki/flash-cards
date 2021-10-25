json.cards @cards do |card|
  json.id card.id
  json.question card.question
  json.tags card.tags.pluck(:name).sort.join(', ')
  json.streak card.streak
end
json.pageNumbers @page_numbers
json.morePages @more_pages
