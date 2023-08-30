class Chained < ActiveRecord::Migration[7.0]
  def change
    add_column :quiz_questions, :chained, :boolean, default: false
  end
end
