class QuizzesController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @quiz = Quiz.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

  def run
    @quiz = Quiz.find_by(id: params[:id])
    render 'run', formats: [:html], handlers: [:erb]
  end

end
