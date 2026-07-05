json.key_format! camelize: :lower
json.deep_format_keys!

json.merge! @card.quiz_content_data

if @card.multiple_choice?
  tag_id = @card.tags.first.id
  other_answers = CardTag.includes(:cardtagable).where(tag_id: tag_id, cardtagable_type: "Card").map(&:cardtagable).pluck(:answer)
  json.choices([@card.answer] + (other_answers.shuffle - [@card.answer]).take(7))
end
