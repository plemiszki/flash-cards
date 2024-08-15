class FrenchNounsUncountable < ActiveRecord::Migration[7.1]
  def change
    add_column :french_nouns, :uncountable, :boolean, default: false
  end
end
