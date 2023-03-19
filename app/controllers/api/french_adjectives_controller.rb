class Api::FrenchAdjectivesController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @french_adjectives = FrenchAdjective.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @french_adjective = FrenchAdjective.new(french_adjective_params)
    if @french_adjective.save
      if params[:french_adjective][:needs_attention] == "true"
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'FrenchAdjective', cardtagable_id: @french_adjective.id, tag_id: tag_id)
      end
      @french_adjectives = FrenchAdjective.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_adjective)
    end
  end

  def show
    @french_adjective = FrenchAdjective.find(params[:id])
    @french_adjective_tags = @french_adjective.card_tags
    @tags = Tag.all.order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @french_adjective = FrenchAdjective.find(params[:id])
    if @french_adjective.update(french_adjective_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_adjective)
    end
  end

  def destroy
    french_adjective = FrenchAdjective.find(params[:id])
    french_adjective.destroy
    render json: french_adjective
  end

  private

  def french_adjective_params
    result = params[:french_adjective].permit(
      :english,
      :masculine,
      :masculine_plural,
      :feminine,
      :feminine_plural,
      :streak,
      :last_streak_add
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result
  end

end
