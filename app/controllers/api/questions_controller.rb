class Api::QuestionsController < AdminController

  def index
    @questions = Question.all
    render 'index.json.jbuilder'
  end

  def create
    @question = Question.new(questions_params)
    if @question.save
      @questions = Question.all
      render 'index.json.jbuilder'
    else
      render json: @questions.errors.full_messages, status: 422
    end
  end

  def show
    @question = Question.find(params[:id])
    render 'show.json.jbuilder'
  end

  def update
    @question = Question.find(params[:id])
    if @question.update(questions_params)
      render 'show.json.jbuilder'
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
