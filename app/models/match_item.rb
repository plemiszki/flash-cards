class MatchItem < ActiveRecord::Base

  validates :name, :match_bin_id, presence: true

  belongs_to :match_bin

end
