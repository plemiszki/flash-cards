class CreateHighlights < ActiveRecord::Migration[8.1]
  def change
    create_table :highlights do |t|
      t.integer :highlightable_id, null: false
      t.string :highlightable_type, null: false

      t.timestamps
    end

    add_index :highlights, [:highlightable_type, :highlightable_id]
  end
end
