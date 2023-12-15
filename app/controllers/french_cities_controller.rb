class FrenchCitiesController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @french_city = FrenchCity.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

end
