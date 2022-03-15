class NounsController < AdminController

  def index
  end

  def show
    @noun = Noun.find_by(id: params[:id])
  end

end
