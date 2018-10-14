class QuizzesController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @quiz = Quiz.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
