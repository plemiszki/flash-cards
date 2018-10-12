class CreateVerbs < ActiveRecord::Migration[5.0]
  def change
    create_table :verbs do |t|
      t.string :english, null: false
      t.string :infinitive, null: false
    end
  end
end
