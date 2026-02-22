json.quizQuestionTags @quiz_question.quiz_question_tags.includes(:tag).map { |qqt| { id: qqt.id, name: qqt.tag.name } }
