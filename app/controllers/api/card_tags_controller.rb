class Api::CardTagsController < AdminController

  def create
    @card_tag = CardTag.new(card_tag_params)
    if @card_tag.save
      @card_tags = CardTag.where(card_id: @card_tag.card_id)
      render 'index.json.jbuilder'
    else
      render json: @card_tag.errors.full_messages, status: 422
    end
  end

  def destroy
    card_tag = CardTag.find(params[:id])
    card_tag.destroy
    @card_tags = CardTag.where(card_id: card_tag.card_id)
    render 'index.json.jbuilder'
  end

  private

  def card_tag_params
    params[:card_tag].permit(:card_id, :tag_id, :card_type)
  end

end
