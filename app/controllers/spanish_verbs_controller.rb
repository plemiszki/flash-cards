class SpanishVerbsController < AdminController

  def index
  end

  def show
    @verb = SpanishVerb.find_by(id: params[:id])
  end

end
