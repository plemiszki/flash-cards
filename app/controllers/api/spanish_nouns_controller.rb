class Api::SpanishNounsController < AdminController

  def index
    @spanish_nouns = SpanishNoun.all
    render 'index.json.jbuilder'
  end

  def create
    @spanish_noun = SpanishNoun.new(spanish_noun_params)
    if @spanish_noun.save
      if params[:spanish_noun][:needs_attention] == "true"
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'SpanishNoun', cardtagable_id: @spanish_noun.id, tag_id: tag_id)
      end
      @spanish_nouns = SpanishNoun.all
      render 'index.json.jbuilder'
    else
      render json: @spanish_noun.errors.full_messages, status: 422
    end
  end

  def show
    @spanish_noun = SpanishNoun.find(params[:id])
    @spanish_noun_tags = @spanish_noun.card_tags
    @tags = Tag.all.order(:name)
    render 'show.json.jbuilder'
  end

  def update
    @spanish_noun = SpanishNoun.find(params[:id])
    if @spanish_noun.update(spanish_noun_params)
      render 'show.json.jbuilder'
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
    params[:spanish_noun].permit(:english, :english_plural, :spanish, :spanish_plural, :gender)
  end

end
