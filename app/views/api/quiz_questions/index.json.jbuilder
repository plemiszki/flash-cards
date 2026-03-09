json.quizQuestions @quiz_questions do |quiz_question|
  json.partial! 'api/quiz_questions/quiz_question', quiz_question: quiz_question
end
