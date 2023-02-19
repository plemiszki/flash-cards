class VocabularyController < AdminController

  def index
    render 'index', formats: [:html], handlers: [:erb]
  end

end
