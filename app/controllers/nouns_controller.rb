class NounsController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @noun = Noun.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
