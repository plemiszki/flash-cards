class SpanishAdjectivesController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @adjective = SpanishAdjective.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

end
