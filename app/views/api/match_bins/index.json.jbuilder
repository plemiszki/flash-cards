json.matchBins @match_bins do |match_bin|
  json.id match_bin.id
  json.name match_bin.name
  json.matchItems match_bin.match_items do |match_item|
    json.id match_item.id
    json.name match_item.name
  end
end
