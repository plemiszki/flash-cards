class Api::SpanishVerbsController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @spanish_verbs = SpanishVerb.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    needs_attention = spanish_verb_params[:needs_attention]
    @spanish_verb = SpanishVerb.new(spanish_verb_params.except(:needs_attention))
    if @spanish_verb.save
      if needs_attention
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'SpanishVerb', cardtagable_id: @spanish_verb.id, tag_id: tag_id)
      end
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
    result = params[:spanish_verb].permit(:english, :spanish, :streak, :last_streak_add, :note, :forms, :needs_attention)
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result
  end

end
