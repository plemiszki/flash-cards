class AddPositionToMatchBins < ActiveRecord::Migration[8.1]
  def change
    add_column :match_bins, :position, :integer
    add_index :match_bins, [:card_id, :position], unique: true
  end
end
