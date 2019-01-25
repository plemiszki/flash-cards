class AddArchivedColumn < ActiveRecord::Migration[5.0]
  def change
    add_column :quizzes, :use_archived, :boolean, default: false
  end
end
