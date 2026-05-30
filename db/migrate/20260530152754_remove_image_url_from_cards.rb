class RemoveImageUrlFromCards < ActiveRecord::Migration[8.1]
  def change
    remove_column :cards, :image_url, :string, default: ""
  end
end
