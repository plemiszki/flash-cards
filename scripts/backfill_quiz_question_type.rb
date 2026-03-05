QuizQuestion.where(use_all_available: true).find_each do |quiz_question|
  quiz_question.update!(quiz_question_type: :all_highlighted)
end

puts "Done."

# Backfill: change all_non_archived (2) to all_highlighted (1)
count = QuizQuestion.where(quiz_question_type: 2).count
puts "Found #{count} QuizQuestion record(s) with type all_non_archived"

QuizQuestion.where(quiz_question_type: 2).update_all(quiz_question_type: 1)

puts "Updated #{count} record(s) to all_highlighted"
