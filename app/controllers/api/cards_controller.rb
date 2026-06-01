class Api::CardsController < AdminController

  include SearchIndex

  after_action :remove_highlight_if_ready, only: [:update]

  def index
    @cards = perform_search(model: 'Card', associations: [:tags])
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def new
    @tags = Tag.all.order(:name)
    render 'new', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @card = Card.new(card_params)
    ActiveRecord::Base.transaction do
      @card.save!
      CardTag.create!(cardtagable: @card, cardtagable_type: 'Card', tag_id: params[:tag_id]) if params[:tag_id]
      Highlight.create!(highlightable: @card)
    end
    render 'create', formats: [:json], handlers: [:jbuilder]
  rescue ActiveRecord::RecordInvalid => e
    render_errors(e.record)
  end

  def show
    @card = Card.find(params[:id])
    @card_tags = @card.card_tags
    @tags = Tag.all.order(:name)
    @match_bins = @card.match_bins.includes(:match_items)
    @highlighted = @card.highlights.exists?
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @card = Card.find(params[:id])
    if @card.update(card_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@card)
    end
  end

  def destroy
    card = Card.find(params[:id])
    card.destroy
    render json: card
  end

  private

  def card_params
    result = params[:card].permit(
      :question,
      :answer,
      :answer_placeholder,
      :cloudinary_url,
      :multiple_choice,
      :streak,
      :last_streak_add,
      :hint,
      :config,
      :streak_freeze_expiration,
      :notes,
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result.merge!({ streak_freeze_expiration: Time.at(result[:streak_freeze_expiration].to_i) }) if result[:streak_freeze_expiration]
    result.merge!({ config: JSON.parse(result[:config])}) if result[:config]
    result
  end

  def remove_highlight_if_ready
    if @card.streak >= 5
      highlight = Highlight.find_by(highlightable: @card)
      highlight.destroy if highlight
    end
  end

end
