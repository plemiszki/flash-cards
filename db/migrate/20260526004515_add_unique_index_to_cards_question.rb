class AddUniqueIndexToCardsQuestion < ActiveRecord::Migration[8.1]
  def change
    add_index :cards, [:question, :cloudinary_url], unique: true
  end
end
