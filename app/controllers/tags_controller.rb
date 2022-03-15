class TagsController < AdminController

  def index
  end

  def show
    @tag = Tag.find_by(id: params[:id])
  end

end
