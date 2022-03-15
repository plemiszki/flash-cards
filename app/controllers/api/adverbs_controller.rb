class Api::AdverbsController < AdminController

  def index
    @adverbs = Adverb.all
  end

  def create
    @adverb = Adverb.new(adverb_params)
    if @adverb.save
      @adverbs = Adverb.all
      render 'index'
    else
      render json: @adverb.errors.full_messages, status: 422
    end
  end

  def show
    @adverb = Adverb.find(params[:id])
  end

  def update
    @adverb = Adverb.find(params[:id])
    if @adverb.update(adverb_params)
      render 'show'
    else
      render json: @adverb.errors.full_messages, status: 422
    end
  end

  def destroy
    adverb = Adverb.find(params[:id])
    adverb.destroy
    render json: adverb
  end

  private

  def adverb_params
    params[:adverb].permit(:english, :transliterated, :foreign)
  end

end
