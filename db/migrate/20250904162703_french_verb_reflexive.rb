class FrenchVerbReflexive < ActiveRecord::Migration[8.0]
  def change
    add_column :french_verbs, :reflexive, :boolean, null: false, default: false
  end
end
