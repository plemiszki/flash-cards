class SpanishAdjectivesController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @adjective = SpanishAdjective.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
