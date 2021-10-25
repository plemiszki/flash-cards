class Api::CardsController < AdminController

  include SearchIndex

  after_action :archive, only: [:update]

  def index
    @cards = perform_search(model: 'Card')
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def index_archived
    @cards = Card.archived
    render 'index.json.jbuilder'
  end

  def create
    @card = Card.new(card_params)
    if @card.save
      render 'create.json.jbuilder'
    else
      render json: @card.errors.full_messages, status: 422
    end
  end

  def show
    @card = Card.find(params[:id])
    @card_tags = @card.card_tags
    @tags = Tag.all.order(:name)
    @match_bins = @card.match_bins.includes(:match_items)
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
    result = params[:card].permit(:question, :answer, :answer_placeholder, :image_url, :multiple_choice, :streak, :last_streak_add)
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result
  end

  def archive
    if @card.streak >= 5
      unless @card.tags.pluck(:name).include?('Archived')
        CardTag.create(cardtagable_id: @card.id, tag_id: Tag.find_by_name('Archived').id, cardtagable_type: 'Card')
      end
    end
  end

end
