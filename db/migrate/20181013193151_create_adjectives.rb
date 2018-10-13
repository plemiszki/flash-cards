class CreateAdjectives < ActiveRecord::Migration[5.0]
  def change
    create_table :adjectives do |t|
      t.string :english, null: false
      t.string :masculine, null: false
      t.string :feminine, null: false
    end
  end
end
