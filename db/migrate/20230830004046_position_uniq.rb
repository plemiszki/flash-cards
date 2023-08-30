class PositionUniq < ActiveRecord::Migration[7.0]
  def change
    add_unique_key :quiz_questions, [:quiz_id, :position], deferrable: :deferred
  end
end
