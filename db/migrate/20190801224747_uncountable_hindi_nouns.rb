class UncountableHindiNouns < ActiveRecord::Migration[5.2]
  def change
    add_column :nouns, :uncountable, :boolean, default: false
  end
end
