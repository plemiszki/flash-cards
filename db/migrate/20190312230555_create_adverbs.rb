class CreateAdverbs < ActiveRecord::Migration[5.0]
  def change
    create_table :adverbs do |t|
      t.string :foreign, null: false
      t.string :transliterated, null: false
      t.string :english, null: false
    end

    add_index :adverbs, [:foreign, :english], unique: true
  end
end
