class VerbForms < ActiveRecord::Migration[6.0]
  def change
    add_column :spanish_verbs, :forms, :jsonb, default: {}
  end
end
