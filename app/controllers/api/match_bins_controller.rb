class Api::MatchBinsController < AdminController

  def create
    match_bin = MatchBin.new(match_bin_params)
    if match_bin.save
      @match_bins = MatchBin.where(card_id: match_bin.card_id)
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render json: match_bin.errors.full_messages, status: 422
    end
  end

  def destroy
    match_bin = MatchBin.find(params[:id])
    match_bin.destroy
    @match_bins = MatchBin.where(card_id: match_bin.card_id)
    render "index.json.jbuilder"
  end

  private

  def match_bin_params
    params[:match_bin].permit(:name, :card_id)
  end

end
