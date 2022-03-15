class SpanishNounsController < AdminController

  def index
  end

  def show
    @noun = SpanishNoun.find_by(id: params[:id])
  end

end
