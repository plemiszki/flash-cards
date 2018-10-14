class Api::QuizzesController < AdminController

  def index
    @quizzes = Quiz.all
    render 'index.json.jbuilder'
  end

  def create
    @quiz = Quiz.new(quiz_params)
    if @quiz.save
      @quizzes = Quiz.all
      render 'index.json.jbuilder'
    else
      render json: @quiz.errors.full_messages, status: 422
    end
  end

  def show
    @quiz = Quiz.find(params[:id])
    render 'show.json.jbuilder'
  end

  def update
    @quiz = Quiz.find(params[:id])
    if @quiz.update(quiz_params)
      render 'show.json.jbuilder'
    else
      render json: @quiz.errors.full_messages, status: 422
    end
  end

  def destroy
    quiz = Quiz.find(params[:id])
    quiz.destroy
    render json: quiz
  end

  private

  def quiz_params
    params[:quiz].permit(:name)
  end

end
