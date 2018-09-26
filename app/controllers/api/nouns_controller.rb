class Api::NounsController < AdminController

  def show
    @noun = Noun.find(params[:id])
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

  private

  def noun_params
    params[:noun].permit(:english, :english_plural, :foreign, :foreign_plural, :gender, :transliterated, :transliterated_plural)
  end

end
