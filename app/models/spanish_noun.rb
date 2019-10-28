class SpanishNoun < ActiveRecord::Base

  validates_presence_of :english, :english_plural, :spanish, :spanish_plural, :gender
  validates_uniqueness_of :english, scope: :spanish, message: '/ Spanish combo already used'

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def synonyms
    SpanishNoun.where(english: self.english)
  end

  def male?
    gender == 1
  end

  def female?
    gender == 2
  end

  def with_article(article:, use_plural: false)
    if article == 'indefinite'
    elsif article == 'definite'
      if male?
        use_plural ? "los #{spanish_plural}" : "el #{spanish}"
      elsif female?
        use_plural ? "las #{spanish_plural}" : "la #{spanish}"
      end
    end
  end

end
