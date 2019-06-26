class AddMatchingTables < ActiveRecord::Migration[5.2]
  def change
    create_table :match_bins do |t|
      t.string :name, null: false
      t.integer :card_id, null: false
    end
    create_table :match_items do |t|
      t.string :name, null: false
      t.integer :match_bin_id, null: false
    end
  end
end
