class Api::VerbsController < AdminController

  def index
    @verbs = Verb.all
    render 'index.json.jbuilder'
  end

  def create
    @verb = Verb.new(verb_params)
    if @verb.save
      @verbs = Verb.all
      render 'index.json.jbuilder'
    else
      render json: @verb.errors.full_messages, status: 422
    end
  end

  def show
    @verb = Verb.find(params[:id])
    render 'show.json.jbuilder'
  end

  def update
    @verb = Verb.find(params[:id])
    if @verb.update(verb_params)
      render 'show.json.jbuilder'
    else
      render json: @verb.errors.full_messages, status: 422
    end
  end

  def destroy
    verb = Verb.find(params[:id])
    verb.destroy
    render json: verb
  end

  private

  def verb_params
    params[:verb].permit(:english, :infinitive, :transliterated_infinitive)
  end

end
