QuizQuestionTag.delete_all
QuizQuestion.delete_all
Tag.delete_all
Quiz.delete_all
Card.delete_all

quiz = Quiz.create!(name: "General", max_questions: 0)

chemistry_tag = Tag.create!(name: "Chemistry")
biology_tag = Tag.create!(name: "Biology")
physics_tag = Tag.create!(name: "Physics")

card_question = Question.find_by!(name: "Card")
quiz_question = QuizQuestion.create!(quiz: quiz, question_id: card_question.id, amount: 10, position: 0)

QuizQuestionTag.create!(quiz_question: quiz_question, tag: chemistry_tag)
QuizQuestionTag.create!(quiz_question: quiz_question, tag: biology_tag)
QuizQuestionTag.create!(quiz_question: quiz_question, tag: physics_tag)
