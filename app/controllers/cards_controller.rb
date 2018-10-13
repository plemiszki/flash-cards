class CardsController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @card = Card.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
