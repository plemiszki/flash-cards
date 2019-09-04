class Api::AdjectivesController < AdminController

  def index
    @adjectives = Adjective.all
    render 'index.json.jbuilder'
  end

  def create
    @adjective = Adjective.new(adjective_params)
    if @adjective.save
      if params[:adjective][:needs_attention] == "true"
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'Adjective', cardtagable_id: @adjective.id, tag_id: tag_id)
      end
      @adjectives = Adjective.all
      render 'index.json.jbuilder'
    else
      render json: @adjective.errors.full_messages, status: 422
    end
  end

  def show
    @adjective = Adjective.find(params[:id])
    @adjective_tags = @adjective.card_tags
    @tags = Tag.all.order(:name)
    render 'show.json.jbuilder'
  end

  def update
    @adjective = Adjective.find(params[:id])
    if @adjective.update(adjective_params)
      render 'show.json.jbuilder'
    else
      render json: @adjective.errors.full_messages, status: 422
    end
  end

  def destroy
    adjective = Adjective.find(params[:id])
    adjective.destroy
    render json: adjective
  end

  private

  def adjective_params
    params[:adjective].permit(:english, :masculine, :feminine, :masculine_plural, :transliterated_masculine, :transliterated_feminine, :transliterated_masculine_plural)
  end

end
