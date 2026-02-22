class Api::QuizQuestionTagsController < AdminController

  def create
    quiz_question_tag = QuizQuestionTag.new(quiz_question_tag_params)
    if quiz_question_tag.save
      @quiz_question = quiz_question_tag.quiz_question
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(quiz_question_tag)
    end
  end

  private

  def quiz_question_tag_params
    params[:quiz_question_tag].permit(:quiz_question_id, :tag_id)
  end

end
