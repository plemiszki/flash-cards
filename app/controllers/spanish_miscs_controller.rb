class SpanishMiscsController < AdminController

  def index
  end

  def show
    @spanish_misc = SpanishMisc.find_by(id: params[:id])
  end

end
