json.entity do
  json.id @quiz.id
  json.name @quiz.name
end
json.array1 @quiz_questions do |quiz_question|
  json.id quiz_question.id
  json.questionName quiz_question.question.name
  json.amount quiz_question.amount
end
