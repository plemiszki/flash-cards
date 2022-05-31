class QuestionsController < AdminController

  def index
    render 'index.html.erb'
  end

  def show
    @question = Question.find_by(id: params[:id])
    render 'show.html.erb'
  end

end
