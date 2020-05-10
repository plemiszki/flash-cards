class AddUseAllAvailableColumn < ActiveRecord::Migration[5.2]
  def change
    add_column :quiz_questions, :use_all_available, :boolean, default: false
  end
end
