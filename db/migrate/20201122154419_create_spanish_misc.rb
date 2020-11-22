class CreateSpanishMisc < ActiveRecord::Migration[6.0]
  def change
    create_table :spanish_miscs do |t|
      t.string :spanish, null: false
      t.string :english, null: false
    end
  end
end
