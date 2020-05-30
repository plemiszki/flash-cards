class StreakDates < ActiveRecord::Migration[5.2]
  def change
    add_column :nouns, :last_streak_add, :date
    add_column :verbs, :last_streak_add, :date
    add_column :adjectives, :last_streak_add, :date
    add_column :spanish_nouns, :last_streak_add, :date
    add_column :spanish_verbs, :last_streak_add, :date
    add_column :spanish_adjectives, :last_streak_add, :date
  end
end
