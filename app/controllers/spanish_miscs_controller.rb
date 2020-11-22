class SpanishMiscsController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @spanish_misc = SpanishMisc.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
