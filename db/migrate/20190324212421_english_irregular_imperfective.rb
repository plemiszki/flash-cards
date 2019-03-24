class EnglishIrregularImperfective < ActiveRecord::Migration[5.2]
  def change
    add_column :verbs, :english_irregular_imperfective, :string, default: ""
  end
end
