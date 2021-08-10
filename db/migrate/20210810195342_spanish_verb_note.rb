class SpanishVerbNote < ActiveRecord::Migration[6.0]
  def change
    add_column :spanish_verbs, :note, :string, default: ""
  end
end
