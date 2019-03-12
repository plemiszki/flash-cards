class AdverbsController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @adverb = Adverb.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
