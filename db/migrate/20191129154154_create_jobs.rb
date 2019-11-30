class CreateJobs < ActiveRecord::Migration[5.2]
  def change
    create_table :jobs do |t|
      t.string :name, null: false
      t.string :text, default: ''
      t.boolean :show_progress, default: true
      t.integer :current_value, default: 0
      t.integer :total_value, default: 0
      t.jsonb :metadata, default: {}
      t.boolean :done, default: false
      t.boolean :killed, default: false
    end
  end
end
