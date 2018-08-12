class CreateNouns < ActiveRecord::Migration[5.0]
  def change
    create_table :nouns do |t|
      t.string :english, null: false
      t.string :english_plural, null: false
      t.string :foreign, null: false
      t.string :foreign_plural, null: false
      t.integer :gender, null: false

      t.timestamps
    end
  end
end
