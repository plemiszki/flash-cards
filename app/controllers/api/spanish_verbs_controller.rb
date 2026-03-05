class Api::SpanishVerbsController < AdminController

  include Wordable

  after_action :remove_highlight_if_ready, only: [:update]

  def index
    @spanish_verbs = SpanishVerb.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @spanish_verb = SpanishVerb.new(spanish_verb_params)
    if @spanish_verb.save
      Highlight.create!(highlightable: @spanish_verb) if params[:spanish_verb][:highlight]
      @spanish_verbs = SpanishVerb.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@spanish_verb)
    end
  end

  def show
    @spanish_verb = SpanishVerb.find(params[:id])
    @spanish_verb_tags = @spanish_verb.card_tags
    @tags = Tag.all.order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @spanish_verb = SpanishVerb.find(params[:id])
    if @spanish_verb.update(spanish_verb_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@spanish_verb)
    end
  end

  def destroy
    spanish_verb = SpanishVerb.find(params[:id])
    spanish_verb.destroy
    render json: spanish_verb
  end

  private

  def spanish_verb_params
    result = params[:spanish_verb].permit(
      :english,
      :spanish,
      :streak,
      :last_streak_add,
      :note,
      :forms,
      :streak_freeze_expiration,
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result.merge!({ streak_freeze_expiration: Time.at(result[:streak_freeze_expiration].to_i) }) if result[:streak_freeze_expiration]
    result
  end

end
