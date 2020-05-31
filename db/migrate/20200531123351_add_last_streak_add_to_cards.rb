class AddLastStreakAddToCards < ActiveRecord::Migration[5.2]
  def change
    add_column :cards, :last_streak_add, :date
  end
end
