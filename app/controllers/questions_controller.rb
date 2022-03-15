class QuestionsController < AdminController

  def index
  end

  def show
    @question = Question.find_by(id: params[:id])
  end

end
