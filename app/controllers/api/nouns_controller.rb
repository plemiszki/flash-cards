class Api::NounsController < AdminController

  def index
    @nouns = Noun.all
    render 'index.json.jbuilder'
  end

  def create
    @noun = Noun.new(noun_params)
    if @noun.save
      @nouns = Noun.all
      render 'index.json.jbuilder'
    else
      render json: @noun.errors.full_messages, status: 422
    end
  end

  def show
    @noun = Noun.find(params[:id])
    @noun_tags = @noun.card_tags
    @tags = Tag.all.order(:name)
    render 'show.json.jbuilder'
  end

  def update
    @noun = Noun.find(params[:id])
    if @noun.update(noun_params)
      render 'show.json.jbuilder'
    else
      render json: @noun.errors.full_messages, status: 422
    end
  end

  def destroy
    noun = Noun.find(params[:id])
    noun.destroy
    render json: noun
  end

  private

  def noun_params
    params[:noun].permit(:english, :english_plural, :foreign, :foreign_plural, :gender, :transliterated, :transliterated_plural)
  end

end
