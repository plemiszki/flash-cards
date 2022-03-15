class SpanishAdjectivesController < AdminController

  def index
  end

  def show
    @adjective = SpanishAdjective.find_by(id: params[:id])
  end

end
