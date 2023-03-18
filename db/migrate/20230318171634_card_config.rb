class CardConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :cards, :config, :jsonb, default: {}
  end
end
