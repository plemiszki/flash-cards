class AddNotes < ActiveRecord::Migration[7.0]
  def change
    add_column :cards, :notes, :string, default: ""
    add_column :french_nouns, :url, :string, default: ""
    add_column :french_verbs, :url, :string, default: ""
    add_column :french_adjectives, :url, :string, default: ""
    add_column :french_miscs, :url, :string, default: ""
    add_column :french_countries, :url, :string, default: ""
    add_column :french_cities, :url, :string, default: ""
  end
end
