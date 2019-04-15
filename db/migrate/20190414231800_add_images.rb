class AddImages < ActiveRecord::Migration[5.2]
  def change
    add_column :cards, :image_url, :string, default: ""
  end
end
