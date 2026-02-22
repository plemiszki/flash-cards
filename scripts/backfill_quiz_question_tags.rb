QuizQuestion.where.not(tag_id: nil).find_each do |quiz_question|
  next if QuizQuestionTag.exists?(quiz_question_id: quiz_question.id, tag_id: quiz_question.tag_id)

  QuizQuestionTag.create!(quiz_question_id: quiz_question.id, tag_id: quiz_question.tag_id)
end

puts "Done."
