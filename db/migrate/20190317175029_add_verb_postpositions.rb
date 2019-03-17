class AddVerbPostpositions < ActiveRecord::Migration[5.2]
  def change
    add_column :verbs, :postposition, :string, default: ""
  end
end
