class AdverbsController < AdminController

  def index
  end

  def show
    @adverb = Adverb.find_by(id: params[:id])
  end

end
