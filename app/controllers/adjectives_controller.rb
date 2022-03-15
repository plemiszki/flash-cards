class AdjectivesController < AdminController

  def index
  end

  def show
    @adjective = Adjective.find_by(id: params[:id])
  end

end
