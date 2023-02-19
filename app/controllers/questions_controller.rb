class QuestionsController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

  def show
    @question = Question.find_by(id: params[:id])
    render 'show', formats: [:html], handlers: [:erb]
  end

end
