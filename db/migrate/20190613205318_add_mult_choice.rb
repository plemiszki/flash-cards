class AddMultChoice < ActiveRecord::Migration[5.2]
  def change
    add_column :cards, :multiple_choice, :boolean, default: false
  end
end
