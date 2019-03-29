class AddEnglishPreposition < ActiveRecord::Migration[5.2]
  def change
    add_column :verbs, :english_preposition, :string, default: ""
  end
end
