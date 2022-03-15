class CardsController < AdminController

  def index
  end

  def show
    @card = Card.find_by(id: params[:id])
  end

end
