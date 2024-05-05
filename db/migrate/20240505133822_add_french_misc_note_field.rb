class AddFrenchMiscNoteField < ActiveRecord::Migration[7.0]
  def change
    add_column :french_miscs, :note, :string, default: ""
  end
end
