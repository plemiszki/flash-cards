class Api::FrenchVerbsController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @french_verbs = FrenchVerb.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    needs_attention = french_verb_params[:needs_attention]
    @french_verb = FrenchVerb.new(french_verb_params.except(:needs_attention))
    if @french_verb.save
      if needs_attention
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'FrenchVerb', cardtagable_id: @french_verb.id, tag_id: tag_id)
      end
      @french_verbs = FrenchVerb.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_verb)
    end
  end

  def show
    @french_verb = FrenchVerb.find(params[:id])
    @french_verb_tags = @french_verb.card_tags
    @tags = Tag.all.order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @french_verb = FrenchVerb.find(params[:id])
    if @french_verb.update(french_verb_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_verb)
    end
  end

  def destroy
    french_verb = FrenchVerb.find(params[:id])
    french_verb.destroy
    render json: french_verb
  end

  private

  def french_verb_params
    result = params[:french_verb].permit(
      :english,
      :french,
      :streak,
      :last_streak_add,
      :note,
      :needs_attention,
      :forms,
      :streak_freeze_expiration,
      :url,
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result.merge!({ streak_freeze_expiration: Time.at(result[:streak_freeze_expiration].to_i) }) if result[:streak_freeze_expiration]
    result
  end

end
