class SpanishMiscsController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @spanish_misc = SpanishMisc.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

end
