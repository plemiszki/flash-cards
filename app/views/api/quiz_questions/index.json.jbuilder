json.quizQuestions @quiz_questions do |quiz_question|
  json.id quiz_question.id
  json.questionName quiz_question.question.name
  json.tagName quiz_question.tag ? quiz_question.tag.name : ''
  json.amount quiz_question.amount
  json.unarchived @available_questions[quiz_question.id][:unarchived]
  json.archived @available_questions[quiz_question.id][:archived]
  json.available @available_questions[quiz_question.id][:available]
  json.useAllAvailable quiz_question.use_all_available
  json.chained quiz_question.chained
  json.position quiz_question.position
end
