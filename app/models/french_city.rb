class FrenchCity < ActiveRecord::Base

  validates_presence_of :english, :french
  validates_uniqueness_of :english, scope: :french, message: '/ French combo already used'

end
