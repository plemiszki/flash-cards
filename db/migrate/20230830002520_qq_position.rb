class QqPosition < ActiveRecord::Migration[7.0]
  def change
    add_column :quiz_questions, :position, :integer
  end
end
