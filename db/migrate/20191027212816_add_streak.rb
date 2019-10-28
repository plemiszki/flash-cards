class AddStreak < ActiveRecord::Migration[5.2]
  def change
    add_column :cards, :streak, :integer, default: 0
    add_column :nouns, :streak, :integer, default: 0
    add_column :verbs, :streak, :integer, default: 0
    add_column :adjectives, :streak, :integer, default: 0
    add_column :spanish_nouns, :streak, :integer, default: 0
    add_column :spanish_verbs, :streak, :integer, default: 0
    add_column :spanish_adjectives, :streak, :integer, default: 0
  end
end
