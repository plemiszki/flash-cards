class AddMatchMaxItemsToCards < ActiveRecord::Migration[8.1]
  def change
    add_column :cards, :match_max_items, :integer, default: 0, null: false
  end
end
