needs_attention_tag = Tag.find_by(name: 'Needs Attention')
archived_tag = Tag.find_by(name: 'Archived')

HIGHLIGHTABLE_TYPES = [
  FrenchNoun,
  FrenchVerb,
  FrenchAdjective,
  FrenchMisc,
  FrenchCity,
  FrenchCountry,
  SpanishNoun,
  SpanishVerb,
  SpanishAdjective,
  SpanishMisc,
]

if needs_attention_tag
  HIGHLIGHTABLE_TYPES.each do |klass|
    klass.joins(:card_tags).where(card_tags: { tag_id: needs_attention_tag.id }).find_each do |entity|
      next if Highlight.exists?(highlightable: entity)

      Highlight.create!(highlightable: entity)
    end
  end
else
  puts "Warning: 'Needs Attention' tag not found, skipping non-Card types."
end

Card.find_each do |card|
  next if archived_tag && card.tags.exists?(id: archived_tag.id)
  next if Highlight.exists?(highlightable: card)

  Highlight.create!(highlightable: card)
end

puts "Done."
