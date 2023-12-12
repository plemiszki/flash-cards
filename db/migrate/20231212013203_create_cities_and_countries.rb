class CreateCitiesAndCountries < ActiveRecord::Migration[7.0]
  def change
    create_table :french_cities do |t|
      t.string :english, null: false
      t.string :french, null: false
      t.integer :streak, default: 0
      t.datetime :streak_freeze_expiration, precision: nil
      t.timestamps
    end

    create_table :french_countries do |t|
      t.string :english, null: false
      t.string :french, null: false
      t.integer :gender, null: false
      t.integer :streak, default: 0
      t.datetime :streak_freeze_expiration, precision: nil
      t.timestamps
    end
  end
end
