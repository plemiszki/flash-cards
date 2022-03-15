class Api::TagsController < AdminController

  def index
    @tags = Tag.all
  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      @tags = Tag.all
      render 'index'
    else
      render json: @tag.errors.full_messages, status: 422
    end
  end

  def show
    @tag = Tag.find(params[:id])
  end

  def update
    @tag = Tag.find(params[:id])
    if @tag.update(tag_params)
      render 'show'
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
