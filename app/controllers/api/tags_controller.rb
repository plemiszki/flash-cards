class Api::TagsController < AdminController

  def index
    @tags = Tag.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      @tags = Tag.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@tag)
    end
  end

  def show
    @tag = Tag.find(params[:id])
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @tag = Tag.find(params[:id])
    if @tag.update(tag_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render json: @tag.errors.full_messages, status: 422
    end
  end

  def destroy
    tag = Tag.find(params[:id])
    tag.destroy
    render json: tag
  end

  private

  def tag_params
    params[:tag].permit(:name)
  end

end
