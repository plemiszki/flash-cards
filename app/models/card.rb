class Card < ActiveRecord::Base

  validates :question, :answer, presence: true

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags

  def self.archived
    self.joins(:tags).where(tags: { name: 'Archived' })
  end

  def self.unarchived
    self.all - self.joins(:tags).where(tags: { name: 'Archived' })
  end

end
