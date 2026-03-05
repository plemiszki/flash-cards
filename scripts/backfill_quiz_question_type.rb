QuizQuestion.where(use_all_available: true).find_each do |quiz_question|
  quiz_question.update!(quiz_question_type: :all_highlighted)
end

puts "Done."

# Backfill: change all_non_archived to all_highlighted
count = QuizQuestion.all_non_archived.count
puts "Found #{count} QuizQuestion record(s) with type all_non_archived"

QuizQuestion.all_non_archived.update_all(quiz_question_type: :all_highlighted)

puts "Updated #{count} record(s) to all_highlighted"
