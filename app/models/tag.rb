class Tag < ActiveRecord::Base

  validates :name, presence: true

  has_many :card_tags, dependent: :destroy
  has_many :quiz_question_tags, dependent: :destroy
  has_many :quiz_questions, dependent: :nullify, foreign_key: :tag_id
  has_many :cards, through: :card_tags, source: :cardtagable, source_type: 'Card'
  has_many :nouns, through: :card_tags, source: :cardtagable, source_type: 'Noun'

end
