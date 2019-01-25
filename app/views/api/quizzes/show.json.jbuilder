json.entity do
  json.id @quiz.id
  json.name @quiz.name
  json.useArchived @quiz.use_archived
end
json.array1 @quiz_questions do |quiz_question|
  json.id quiz_question.id
  json.questionName quiz_question.question.name
  json.tagName quiz_question.tag ? quiz_question.tag.name : ''
  json.amount quiz_question.amount
end
json.array2 @questions do |question|
  json.id question.id
  json.name question.name
end
json.array3 @tags do |tag|
  json.id tag.id
  json.name tag.name
end
