class Api::QuizzesController < AdminController

  include AvailableQuestions

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
    @quiz_questions = @quiz.quiz_questions.includes(:question, :tag)
    @available_questions = get_available_questions(quiz_questions: @quiz_questions, quiz: @quiz)
    @questions = Question.all.order(:name)
    @tags = Tag.all.order(:name)
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

  def run
    quiz = Quiz.find(params[:id])
    @quiz = {
      name: quiz.name,
      questions: quiz.run.map { |element| element.transform_keys { |key| key.to_s.camelize(:lower) } }
    }
    @archived_tag_id = Tag.find_by_name('Archived').id
    @needs_attention_tag_id = Tag.find_by_name('Needs Attention').id
    render 'run.json.jbuilder'
  end

  private

  def quiz_params
    params[:quiz].permit(:name, :use_archived)
  end

end
