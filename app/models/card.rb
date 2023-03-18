class Card < ActiveRecord::Base

  SCHEMA = Pathname.new(Rails.root.join('config', 'schemas', 'card.json')).to_s

  validates :question, :answer, presence: true
  validates :config, json: { schema: JSON.parse(File.read(SCHEMA)) }

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

  def match_answer
    result = ""
    match_bins.each do |match_bin|
      result += "#{match_bin.name.upcase}:\n"
      match_bin.match_items.each do |match_item|
        result += "#{match_item.name}\n"
      end
      result += "\n"
    end
    result
  end

end
