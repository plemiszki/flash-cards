class CardHint < ActiveRecord::Migration[6.0]
  def change
    add_column :cards, :hint, :string, default: ""
  end
end
