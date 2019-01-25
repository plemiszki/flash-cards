class RenameIncludeArchivedColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :quizzes, :include_archived, :use_archived
  end
end
