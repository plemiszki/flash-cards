class Api::VerbsController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @verbs = Verb.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @verb = Verb.new(verb_params)
    if @verb.save
      if params[:verb][:needs_attention] == true
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'Verb', cardtagable_id: @verb.id, tag_id: tag_id)
      end
      @verbs = Verb.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render json: @verb.errors.full_messages, status: 422
    end
  end

  def show
    @verb = Verb.find(params[:id])
    @verb_tags = @verb.card_tags
    @tags = Tag.all.order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @verb = Verb.find(params[:id])
    if @verb.update(verb_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render json: @verb.errors.full_messages, status: 422
    end
  end

  def destroy
    verb = Verb.find(params[:id])
    verb.destroy
    render json: verb
  end

  private

  def verb_params
    result = params[:verb].permit(
      :english,
      :english_irregular_imperfective,
      :infinitive,
      :transliterated_infinitive,
      :irregular_imperative_formal,
      :irregular_imperative_informal,
      :irregular_imperative_formal_transliterated,
      :irregular_imperative_informal_transliterated,
      :postposition,
      :english_preposition,
      :streak,
      :last_streak_add
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result
  end

end
