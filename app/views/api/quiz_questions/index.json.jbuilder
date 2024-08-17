json.quizQuestions @quiz_questions do |quiz_question|
  json.id quiz_question.id
  json.quizId quiz_question.quiz_id
  json.questionName quiz_question.question.name
  json.questionId quiz_question.question.id
  json.tagName quiz_question.tag ? quiz_question.tag.name : ''
  json.tagId quiz_question.tag ? quiz_question.tag.id : ''
  json.amount quiz_question.amount
  json.unarchived quiz_question.unarchived
  json.archived quiz_question.archived
  json.available quiz_question.available
  json.useAllAvailable quiz_question.use_all_available
  json.position quiz_question.position
  json.chained quiz_question.chained
  json.chainedAmount quiz_question.chained_amount
end
