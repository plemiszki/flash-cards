QuizQuestion.where(use_all_available: true).find_each do |quiz_question|
  quiz_question.update!(quiz_question_type: :all_highlighted)
end

puts "Done."
