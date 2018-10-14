class CreateQuizzes < ActiveRecord::Migration[5.0]
  def change
    create_table :quizzes do |t|
      t.string :name, null: false
    end

    create_table :questions do |t|
      t.string :name, null: false
    end

    create_table :quiz_questions do |t|
      t.integer :quiz_id, null: false
      t.integer :question_id, null: false
      t.integer :amount, null: false
      t.integer :tag_id
    end

    add_index :quiz_questions, :quiz_id
    add_index :quiz_questions, :question_id
    add_index :quiz_questions, :tag_id
  end
end
