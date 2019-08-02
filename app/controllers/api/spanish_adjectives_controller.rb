class Api::SpanishAdjectivesController < AdminController

  def index
    @spanish_adjectives = SpanishAdjective.all
    render 'index.json.jbuilder'
  end

  def create
    @spanish_adjective = SpanishAdjective.new(spanish_adjective_params)
    if @spanish_adjective.save
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
    params[:spanish_adjective].permit(:english, :masculine, :masculine_plural, :feminine, :feminine_plural)
  end

end
