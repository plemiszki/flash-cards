class CreateQuizQuestionTags < ActiveRecord::Migration[7.1]
  def change
    create_table :quiz_question_tags do |t|
      t.integer :tag_id, null: false
      t.integer :quiz_question_id, null: false

      t.timestamps
    end

    add_index :quiz_question_tags, [:tag_id, :quiz_question_id], unique: true
  end
end
