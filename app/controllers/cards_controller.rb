class CardsController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @card = Card.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

end
