class FrenchMiscsController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @misc_word = FrenchMisc.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

end
