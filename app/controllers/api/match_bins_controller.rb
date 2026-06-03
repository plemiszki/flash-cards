class Api::MatchBinsController < AdminController

  def create
    match_bin = MatchBin.new(match_bin_params)
    if match_bin.save
      @match_bins = MatchBin.where(card_id: match_bin.card_id).order(:name)
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render json: match_bin.errors.full_messages, status: 422
    end
  end

  def update
    match_bin = MatchBin.find(params[:id])
    match_bin.update!(match_bin_params)
    @match_bins = MatchBin.where(card_id: match_bin.card_id).order(:name)
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def move
    match_bin = MatchBin.find(params[:id])
    direction = params[:direction]
    adjacent_position = direction == "left" ? match_bin.position - 1 : match_bin.position + 1
    adjacent = MatchBin.find_by(card_id: match_bin.card_id, position: adjacent_position)
    if adjacent
      original_position = match_bin.position
      match_bin.update_column(:position, nil)
      adjacent.update_column(:position, original_position)
      match_bin.update_column(:position, adjacent_position)
    end
    @match_bins = MatchBin.where(card_id: match_bin.card_id).order(:name)
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def destroy
    match_bin = MatchBin.find(params[:id])
    match_bin.destroy
    @match_bins = MatchBin.where(card_id: match_bin.card_id).order(:name)
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  private

  def match_bin_params
    params[:match_bin].permit(:name, :card_id)
  end

end
