class Card < ActiveRecord::Base

  validates :question, :answer, presence: true

end
