class SpanishNoun < ActiveRecord::Base

  validates_presence_of :english, :english_plural, :spanish, :spanish_plural, :gender
  validates_uniqueness_of :english, scope: :spanish, message: '/ Spanish combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    SpanishNoun.where(english: self.english)
  end

end
