json.quizQuestions @quiz_questions do |quiz_question|
  json.id quiz_question.id
  json.questionName quiz_question.question.name
  json.tagName quiz_question.tag ? quiz_question.tag.name : ''
  json.amount quiz_question.amount
  json.available @available_questions[quiz_question.id]
  json.useAllAvailable quiz_question.use_all_available
end
