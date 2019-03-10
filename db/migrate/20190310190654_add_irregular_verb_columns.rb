class AddIrregularVerbColumns < ActiveRecord::Migration[5.0]
  def change
    add_column :verbs, :irregular_imperative_informal, :string, default: ""
    add_column :verbs, :irregular_imperative_formal, :string, default: ""
    add_column :verbs, :irregular_imperative_informal_transliterated, :string, default: ""
    add_column :verbs, :irregular_imperative_formal_transliterated, :string, default: ""
  end
end
