class AdverbsController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @adverb = Adverb.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

end
