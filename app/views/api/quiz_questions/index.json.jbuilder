json.quizQuestions @quiz_questions do |quiz_question|
  json.id quiz_question.id
  json.questionName quiz_question.question.name
  json.tagName quiz_question.tag ? quiz_question.tag.name : ''
  json.amount quiz_question.amount
  json.unarchived quiz_question.unarchived
  json.archived quiz_question.archived
  json.available quiz_question.available
  json.useAllAvailable quiz_question.use_all_available
  json.position quiz_question.position
  json.chained quiz_question.chained
  json.chainedAmount quiz_question.chained_amount
end
