class AddCloudinaryUrl < ActiveRecord::Migration[8.0]
  def change
    add_column :cards, :cloudinary_url, :string, default: ""
  end
end
