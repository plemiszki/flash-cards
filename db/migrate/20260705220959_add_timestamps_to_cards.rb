class AddTimestampsToCards < ActiveRecord::Migration[8.1]
  def change
    add_timestamps :cards, default: -> { 'CURRENT_TIMESTAMP' }, null: false
  end
end
