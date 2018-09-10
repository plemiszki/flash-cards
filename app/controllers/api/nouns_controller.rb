class Api::NounsController < AdminController

  def show
    @noun = Noun.find(params[:id])
    render 'show.json.jbuilder'
  end

end
