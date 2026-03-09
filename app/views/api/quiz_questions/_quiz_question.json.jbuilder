json.id quiz_question.id
json.quizId quiz_question.quiz_id
json.questionName quiz_question.question.name
json.questionId quiz_question.question.id
json.amount quiz_question.get_amount
json.position quiz_question.position
json.quizQuestionType quiz_question.quiz_question_type
json.chained quiz_question.chained
json.quizQuestionTags quiz_question.quiz_question_tags.filter_map { |qqt| { id: qqt.id, name: qqt.tag.name } if qqt.tag }
