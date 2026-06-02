class RemoveMultipleChoiceFromCards < ActiveRecord::Migration[8.1]
  def change
    remove_column :cards, :multiple_choice, :boolean
  end
end
