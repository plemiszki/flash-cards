class Api::SpanishNounsController < AdminController

  include Wordable

  after_action :remove_highlight_if_ready, only: [:update]

  def index
    @spanish_nouns = SpanishNoun.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @spanish_noun = SpanishNoun.new(spanish_noun_params)
    if @spanish_noun.save
      Highlight.create!(highlightable: @spanish_noun) if params[:spanish_noun][:highlight]
      @spanish_nouns = SpanishNoun.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@spanish_noun)
    end
  end

  def show
    @spanish_noun = SpanishNoun.find(params[:id])
    @spanish_noun_tags = @spanish_noun.card_tags
    @tags = Tag.where.not(id: @spanish_noun_tags.pluck(:tag_id)).order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @spanish_noun = SpanishNoun.find(params[:id])
    if @spanish_noun.update(spanish_noun_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render json: @spanish_noun.errors.full_messages, status: 422
    end
  end

  def destroy
    spanish_noun = SpanishNoun.find(params[:id])
    spanish_noun.destroy
    render json: spanish_noun
  end

  private

  def spanish_noun_params
    result = params[:spanish_noun].permit(
      :english,
      :english_plural,
      :spanish,
      :spanish_plural,
      :gender,
      :streak,
      :last_streak_add,
      :note,
      :streak_freeze_expiration,
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result.merge!({ streak_freeze_expiration: Time.at(result[:streak_freeze_expiration].to_i) }) if result[:streak_freeze_expiration]
    result
  end

end
