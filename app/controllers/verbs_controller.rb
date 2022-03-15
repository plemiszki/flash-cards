class VerbsController < AdminController

  def index
  end

  def show
    @verb = Verb.find_by(id: params[:id])
  end

end
