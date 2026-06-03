class AddMatchBinsFixedPositionsToCards < ActiveRecord::Migration[8.1]
  def change
    add_column :cards, :match_bins_fixed_positions, :boolean, default: false, null: false
  end
end
