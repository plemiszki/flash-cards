class AddEnglishPastTenseToFrenchVerbs < ActiveRecord::Migration[8.1]
  def change
    add_column :french_verbs, :english_past_tense, :string
  end
end
