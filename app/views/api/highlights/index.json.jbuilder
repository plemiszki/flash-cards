json.highlights @highlights do |highlight|
  json.id highlight.id
  json.highlightableId highlight.highlightable_id
  json.highlightableType highlight.highlightable_type
  entity = highlight.highlightable
  json.question entity.question
  json.tags entity.tags.pluck(:name).sort.join(', ')
  json.streak entity.streak
end
