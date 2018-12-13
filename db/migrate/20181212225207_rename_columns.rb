class RenameColumns < ActiveRecord::Migration[5.0]
  def change
    rename_column :card_tags, :card_id, :cardtagable_id
    rename_column :card_tags, :card_type, :cardtagable_type
  end
end
