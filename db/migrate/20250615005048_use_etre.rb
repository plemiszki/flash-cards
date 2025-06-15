class UseEtre < ActiveRecord::Migration[8.0]
  def change
    add_column :french_verbs, :use_etre, :boolean, default: false
  end
end
