class AddMaxQuestions < ActiveRecord::Migration[5.2]
  def change
    add_column :quizzes, :max_questions, :integer, default: 0
  end
end
