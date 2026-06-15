class Card < ActiveRecord::Base

  SCHEMA = Pathname.new(Rails.root.join('config', 'schemas', 'card.json')).to_s

  enum :question_type, { standard: "standard", matching: "matching", multiple_choice: "multiple_choice" }

  validates :question, :answer, presence: true
  validates :question, uniqueness: { scope: :cloudinary_url }
  validates :config, json: { schema: JSON.parse(File.read(SCHEMA)) }

  has_many :card_tags, as: :cardtagable, dependent: :destroy
  has_many :tags, through: :card_tags
  has_many :highlights, as: :highlightable, dependent: :destroy
  has_many :match_bins, -> { order(:name) }

  after_update :sync_match_bin_positions, if: :saved_change_to_match_bins_fixed_positions?

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
    ordered_match_bins.each do |match_bin|
      result[match_bin.name] = []
      match_bin.match_items.shuffle.each do |match_item|
        result[match_bin.name] << match_item.name
      end
    end
    result
  end

  def match_answer
    result = ""
    ordered_match_bins.each do |match_bin|
      result += "#{match_bin.name.upcase}:\n"
      match_bin.match_items.each do |match_item|
        result += "#{match_item.name}\n"
      end
      result += "\n"
    end
    result
  end

  private

  def ordered_match_bins
    match_bins_fixed_positions ? match_bins.order(:position) : match_bins.shuffle
  end

  def sync_match_bin_positions
    match_bins.update_all(position: nil)
    if match_bins_fixed_positions
      match_bins.order(:name).each_with_index do |bin, index|
        bin.update_column(:position, index + 1)
      end
    end
  end

end
