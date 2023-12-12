class FrenchCountry < ActiveRecord::Base

  validates_presence_of :english, :french, :gender
  validates_uniqueness_of :english, scope: :french, message: '/ French combo already used'

  def male?
    gender == 1
  end

  def female?
    gender == 2
  end

end
