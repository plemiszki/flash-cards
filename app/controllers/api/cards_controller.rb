class Api::CardsController < AdminController

  def index
    @cards = Card.all
    render 'index.json.jbuilder'
  end

  def create
    @card = Card.new(card_params)
    if @card.save
      @cards = Card.all
      render 'index.json.jbuilder'
    else
      render json: @card.errors.full_messages, status: 422
    end
  end

  def show
    @card = Card.find(params[:id])
    @card_tags = @card.card_tags
    @tags = Tag.all.order(:name)
    render 'show.json.jbuilder'
  end

  def update
    @card = Card.find(params[:id])
    if @card.update(card_params)
      render 'show.json.jbuilder'
    else
      render json: @card.errors.full_messages, status: 422
    end
  end

  def destroy
    card = Card.find(params[:id])
    card.destroy
    render json: card
  end

  private

  def card_params
    params[:card].permit(:question, :answer)
  end

end
