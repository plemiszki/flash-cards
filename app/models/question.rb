class Question < ActiveRecord::Base

  validates :name, presence: true

end
