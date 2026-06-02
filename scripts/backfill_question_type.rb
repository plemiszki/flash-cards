Card.find_each do |card|
  if card.answer == "MATCHING"
    card.update_columns(question_type: "matching")
  elsif card.multiple_choice?
    card.update_columns(question_type: "multiple_choice")
  end
end

puts "Done."
