class Api::QuizQuestionsController < AdminController

  include AvailableQuestions

  def create
    quiz_question = QuizQuestion.new(quiz_question_params)
    if quiz_question.save
      query_response_data(quiz_question)
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(quiz_question)
    end
  end

  def update
    quiz_question = QuizQuestion.find(params[:id])
    if quiz_question.update(quiz_question_params)
      query_response_data(quiz_question)
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(quiz_question)
    end
  end

  def destroy
    quiz_question = QuizQuestion.find(params[:id])
    quiz_question.destroy
    query_response_data(quiz_question)
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  private

  def query_response_data(quiz_question)
    @quiz_questions = QuizQuestion.where(quiz_id: quiz_question.quiz_id).order(:id)
    @available_questions = get_available_questions(quiz_questions: @quiz_questions, quiz: quiz_question.quiz)
  end

  def quiz_question_params
    params[:quiz_question].permit(:quiz_id, :question_id, :tag_id, :amount, :use_all_available)
  end

end
