class AddQuizQuestionTypeToQuizQuestions < ActiveRecord::Migration[8.1]
  def change
    add_column :quiz_questions, :quiz_question_type, :integer, null: false, default: 0
  end
end
