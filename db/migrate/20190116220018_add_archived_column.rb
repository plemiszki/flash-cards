class AddArchivedColumn < ActiveRecord::Migration[5.0]
  def change
    add_column :quizzes, :include_archived, :boolean, default: false
  end
end
