class Api::FrenchNounsController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @french_nouns = FrenchNoun.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @french_noun = FrenchNoun.new(french_noun_params)
    if @french_noun.save
      if params[:french_noun][:needs_attention] == true
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'FrenchNoun', cardtagable_id: @french_noun.id, tag_id: tag_id)
      end
      @french_nouns = FrenchNoun.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_noun)
    end
  end

  def show
    @french_noun = FrenchNoun.find(params[:id])
    @french_noun_tags = @french_noun.card_tags
    @tags = Tag.where.not(id: @french_noun_tags.pluck(:tag_id)).order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @french_noun = FrenchNoun.find(params[:id])
    if @french_noun.update(french_noun_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render json: @french_noun.errors.full_messages, status: 422
    end
  end

  def destroy
    french_noun = FrenchNoun.find(params[:id])
    french_noun.destroy
    render json: french_noun
  end

  private

  def french_noun_params
    result = params[:french_noun].permit(
      :english,
      :english_plural,
      :french,
      :french_plural,
      :gender,
      :streak,
      :last_streak_add,
      :note,
      :streak_freeze_expiration,
      :url,
      :uncountable,
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result.merge!({ streak_freeze_expiration: Time.at(result[:streak_freeze_expiration].to_i) }) if result[:streak_freeze_expiration]
    result
  end

end
