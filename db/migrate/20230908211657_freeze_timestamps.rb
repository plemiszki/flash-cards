class FreezeTimestamps < ActiveRecord::Migration[7.0]
  def change
    add_column :cards, :streak_freeze_expiration, :timestamp
    add_column :french_nouns, :streak_freeze_expiration, :timestamp
    add_column :french_verbs, :streak_freeze_expiration, :timestamp
    add_column :french_adjectives, :streak_freeze_expiration, :timestamp
    add_column :french_miscs, :streak_freeze_expiration, :timestamp
    add_column :spanish_nouns, :streak_freeze_expiration, :timestamp
    add_column :spanish_verbs, :streak_freeze_expiration, :timestamp
    add_column :spanish_adjectives, :streak_freeze_expiration, :timestamp
    add_column :spanish_miscs, :streak_freeze_expiration, :timestamp
  end
end
