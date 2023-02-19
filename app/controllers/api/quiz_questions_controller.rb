class Api::QuizQuestionsController < AdminController

  include AvailableQuestions

  def create
    @quiz_question = QuizQuestion.new(quiz_question_params)
    quiz = @quiz_question.quiz
    if @quiz_question.save
      @quiz_questions = QuizQuestion.where(quiz_id: @quiz_question.quiz_id).order(:id)
      @available_questions = get_available_questions(quiz_questions: @quiz_questions, quiz: quiz)
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render json: @quiz_question.errors.full_messages, status: 422
    end
  end

  def update
    @quiz_question = QuizQuestion.find(params[:id])
    quiz = @quiz_question.quiz
    if @quiz_question.update(quiz_question_params)
      @quiz_questions = QuizQuestion.where(quiz_id: @quiz_question.quiz_id).order(:id)
      @available_questions = get_available_questions(quiz_questions: @quiz_questions, quiz: quiz)
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render json: @quiz_question.errors.full_messages, status: 422
    end
  end

  def destroy
    quiz_question = QuizQuestion.find(params[:id])
    quiz = quiz_question.quiz
    quiz_question.destroy
    @quiz_questions = QuizQuestion.where(quiz_id: quiz_question.quiz_id).order(:id)
    @available_questions = get_available_questions(quiz_questions: @quiz_questions, quiz: quiz)
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  private

  def quiz_question_params
    params[:quiz_question].permit(:quiz_id, :question_id, :tag_id, :amount, :use_all_available)
  end

end
