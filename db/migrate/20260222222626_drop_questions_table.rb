class DropQuestionsTable < ActiveRecord::Migration[8.1]
  def change
    remove_index :quiz_questions, :question_id
    drop_table :questions
  end
end
