class AdjectivesController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @adjective = Adjective.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
