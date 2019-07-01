class Card < ActiveRecord::Base

  validates :question, :answer, presence: true

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags
  has_many :match_bins, -> { order(:name) }

  def match_bins_and_items
    result = {}
    match_bins.each do |match_bin|
      result[match_bin.name] = []
      match_bin.match_items.each do |match_item|
        result[match_bin.name] << match_item.name
      end
    end
    result
  end

  def match_bins_and_items_shuffled
    result = {}
    match_bins.shuffle.each do |match_bin|
      result[match_bin.name] = []
      match_bin.match_items.shuffle.each do |match_item|
        result[match_bin.name] << match_item.name
      end
    end
    result
  end

  def self.archived
    self.joins(:tags).where(tags: { name: 'Archived' })
  end

  def self.unarchived
    self.all - self.joins(:tags).where(tags: { name: 'Archived' })
  end

end
