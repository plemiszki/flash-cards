json.quiz do
  json.id @quiz.id
  json.name @quiz.name
  json.maxQuestions @quiz.max_questions.to_s
end
json.quizQuestions @quiz_questions do |quiz_question|
  json.partial! 'api/quiz_questions/quiz_question', quiz_question: quiz_question
end
json.questions @questions do |question|
  json.id question.id
  json.name question.name
  json.entity question.entity
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
