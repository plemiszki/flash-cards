class AddStreakColumnsToMisc < ActiveRecord::Migration[6.0]
  def change
    add_column :spanish_miscs, :streak, :integer, default: 0
    add_column :spanish_miscs, :last_streak_add, :date
  end
end
