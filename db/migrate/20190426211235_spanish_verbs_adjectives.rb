class SpanishVerbsAdjectives < ActiveRecord::Migration[5.2]
  def change
    create_table :spanish_verbs do |t|
      t.string :english, null: false
      t.string :spanish, null: false
    end

    create_table :spanish_adjectives do |t|
      t.string :english, null: false
      t.string :masculine, null: false
      t.string :feminine, null: false
      t.string :masculine_plural, null: false
      t.string :feminine_plural, null: false
    end
  end
end
