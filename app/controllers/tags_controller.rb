class TagsController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @tag = Tag.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

end
