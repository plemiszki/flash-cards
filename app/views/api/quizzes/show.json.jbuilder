json.quiz do
  json.id @quiz.id
  json.name @quiz.name
  json.maxQuestions @quiz.max_questions.to_s
end
json.quizQuestions @quiz_questions do |quiz_question|
  json.id quiz_question.id
  json.questionName quiz_question.question.name
  json.tagName quiz_question.tag ? quiz_question.tag.name : ''
  json.amount quiz_question.amount
  json.unarchived @available_questions[quiz_question.id][:unarchived]
  json.archived @available_questions[quiz_question.id][:archived]
  json.available @available_questions[quiz_question.id][:available]
  json.useAllAvailable quiz_question.use_all_available
end
json.questions @questions do |question|
  json.id question.id
  json.name question.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
