class AddPlaceholderAnswer < ActiveRecord::Migration[6.0]
  def change
    add_column :cards, :answer_placeholder, :string, default: ""
  end
end
