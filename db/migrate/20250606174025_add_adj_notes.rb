class AddAdjNotes < ActiveRecord::Migration[8.0]
  def change
    add_column :french_adjectives, :note, :string, default: ""
  end
end
