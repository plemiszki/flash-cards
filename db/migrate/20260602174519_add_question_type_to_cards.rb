class AddQuestionTypeToCards < ActiveRecord::Migration[8.1]
  def change
    add_column :cards, :question_type, :string, default: "standard", null: false
  end
end
