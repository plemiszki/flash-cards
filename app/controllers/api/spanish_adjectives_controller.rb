class Api::SpanishAdjectivesController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @spanish_adjectives = SpanishAdjective.all
    render 'index.json.jbuilder'
  end

  def create
    @spanish_adjective = SpanishAdjective.new(spanish_adjective_params)
    if @spanish_adjective.save
      if params[:spanish_adjective][:needs_attention] == "true"
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'SpanishAdjective', cardtagable_id: @spanish_adjective.id, tag_id: tag_id)
      end
      @spanish_adjectives = SpanishAdjective.all
      render 'index.json.jbuilder'
    else
      render json: @spanish_adjective.errors.full_messages, status: 422
    end
  end

  def show
    @spanish_adjective = SpanishAdjective.find(params[:id])
    @spanish_adjective_tags = @spanish_adjective.card_tags
    @tags = Tag.all.order(:name)
    render 'show.json.jbuilder'
  end

  def update
    @spanish_adjective = SpanishAdjective.find(params[:id])
    if @spanish_adjective.update(spanish_adjective_params)
      render 'show.json.jbuilder'
    else
      render json: @spanish_adjective.errors.full_messages, status: 422
    end
  end

  def destroy
    spanish_adjective = SpanishAdjective.find(params[:id])
    spanish_adjective.destroy
    render json: spanish_adjective
  end

  private

  def spanish_adjective_params
    result = params[:spanish_adjective].permit(
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
