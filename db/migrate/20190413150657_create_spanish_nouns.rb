class CreateSpanishNouns < ActiveRecord::Migration[5.2]
  def change
    create_table :spanish_nouns do |t|
      t.string :english, null: false
      t.string :english_plural, null: false
      t.string :spanish, null: false
      t.string :spanish_plural, null: false
      t.integer :gender, null: false
    end
  end
end
