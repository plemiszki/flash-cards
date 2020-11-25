class AddNoteField < ActiveRecord::Migration[6.0]
  def change
    add_column :spanish_nouns, :note, :string, default: ""
  end
end
