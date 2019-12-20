class Noun < ActiveRecord::Base

  validates_presence_of :english, :english_plural, :foreign, :foreign_plural, :gender
  validates_uniqueness_of :english, scope: :foreign, message: '/ Hindi combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    Noun.where(english: self.english)
  end

  def male?
    gender == 1
  end

  def female?
    gender == 2
  end

  def countable?
    uncountable == false
  end

  def uncountable?
    uncountable == true
  end

end
