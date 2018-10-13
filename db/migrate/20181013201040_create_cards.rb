class CreateCards < ActiveRecord::Migration[5.0]
  def change
    create_table :cards do |t|
      t.string :question, null: false
      t.string :answer, null: false
    end

    create_table :tags do |t|
      t.string :name, null: false
    end

    create_table :card_tags do |t|
      t.integer :tag_id, null: false
      t.integer :card_id, null: false
      t.string :card_type, default: 'card'
    end
  end
end
