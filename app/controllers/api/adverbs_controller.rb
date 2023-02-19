class Api::AdverbsController < AdminController

  def index
    @adverbs = Adverb.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @adverb = Adverb.new(adverb_params)
    if @adverb.save
      @adverbs = Adverb.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render json: @adverb.errors.full_messages, status: 422
    end
  end

  def show
    @adverb = Adverb.find(params[:id])
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @adverb = Adverb.find(params[:id])
    if @adverb.update(adverb_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
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
