class QuizzesController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @quiz = Quiz.find_by(id: params[:id])
    render 'show.html.erb'
  end

  def run
    @quiz = Quiz.find_by(id: params[:id])
    render 'run.html.erb'
  end

end
