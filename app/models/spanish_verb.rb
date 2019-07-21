class SpanishVerb < ActiveRecord::Base

  validates_presence_of :english, :spanish
  validates_uniqueness_of :english, scope: :spanish, message: '/ Spanish combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    SpanishVerb.where(english: self.english)
  end

end
