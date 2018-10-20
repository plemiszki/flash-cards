class MissingColumns < ActiveRecord::Migration[5.0]
  def change
    add_column :verbs, :transliterated_infinitive, :string
    add_column :adjectives, :transliterated_masculine, :string
    add_column :adjectives, :transliterated_feminine, :string
    add_column :adjectives, :masculine_plural, :string
    add_column :adjectives, :transliterated_masculine_plural, :string
  end
end
