class Api::CardTagsController < AdminController

  def create
    @card_tag = CardTag.new(card_tag_params)
    if @card_tag.save
      @card_tags = CardTag.where(cardtagable_id: @card_tag.cardtagable_id, cardtagable_type: @card_tag.cardtagable_type)
      @tags = Tag.where.not(id: @card_tags.pluck(:tag_id)).order(:name)
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@card_tag)
    end
  end

  def destroy
    card_tag = CardTag.find(params[:id])
    card_tag.destroy
    @card_tags = CardTag.where(cardtagable_id: card_tag.cardtagable_id, cardtagable_type: card_tag.cardtagable_type)
    @tags = Tag.where.not(id: @card_tags.pluck(:tag_id)).order(:name)
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  private

  def card_tag_params
    params[:card_tag].permit(:tag_id, :cardtagable_id, :cardtagable_type)
  end

end
