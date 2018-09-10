class AddTransliteratedColumns < ActiveRecord::Migration[5.0]
  def change
    add_column :nouns, :transliterated, :string
    add_column :nouns, :transliterated_plural, :string
  end
end
