class QuizzesController < AdminController

  def index
  end

  def show
    @quiz = Quiz.find_by(id: params[:id])
  end

  def run
    @quiz = Quiz.find_by(id: params[:id])
  end

end
