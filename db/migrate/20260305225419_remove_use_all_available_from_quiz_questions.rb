class RemoveUseAllAvailableFromQuizQuestions < ActiveRecord::Migration[8.1]
  def change
    remove_column :quiz_questions, :use_all_available, :boolean
  end
end
