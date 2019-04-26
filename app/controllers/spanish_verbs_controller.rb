class SpanishVerbsController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @verb = SpanishVerb.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
