class AddNullConstraintToEnglishPastTenseOnFrenchVerbs < ActiveRecord::Migration[8.1]
  def change
    change_column_null :french_verbs, :english_past_tense, false
  end
end
