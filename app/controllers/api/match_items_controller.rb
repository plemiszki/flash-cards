class Api::MatchItemsController < AdminController

  def create
    match_item = MatchItem.new(match_item_params)
    if match_item.save
      @match_bins = MatchBin.where(card_id: match_item.match_bin.card_id)
      render 'index'
    else
      render json: match_item.errors.full_messages, status: 422
    end
  end

  def destroy
    match_item = MatchItem.find(params[:id])
    match_item.destroy
    @match_bins = MatchBin.where(card_id: match_item.match_bin.card_id)
    render "index"
  end

  private

  def match_item_params
    params[:match_item].permit(:name, :match_bin_id)
  end

end
