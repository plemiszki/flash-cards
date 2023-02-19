class Api::QuestionsController < AdminController

  def index
    @questions = Question.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @question = Question.new(questions_params)
    if @question.save
      @questions = Question.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render json: @question.errors.full_messages, status: 422
    end
  end

  def show
    @question = Question.find(params[:id])
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @question = Question.find(params[:id])
    if @question.update(questions_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render json: @question.errors.full_messages, status: 422
    end
  end

  def destroy
    questions = Question.find(params[:id])
    questions.destroy
    render json: questions
  end

  private

  def questions_params
    params[:question].permit(:name)
  end

end
