class Api::SpanishVerbsController < AdminController

  def index
    @spanish_verbs = SpanishVerb.all
    render 'index.json.jbuilder'
  end

  def create
    @spanish_verb = SpanishVerb.new(spanish_verb_params)
    if @spanish_verb.save
      @spanish_verbs = SpanishVerb.all
      render 'index.json.jbuilder'
    else
      render json: @spanish_verb.errors.full_messages, status: 422
    end
  end

  def show
    @spanish_verb = SpanishVerb.find(params[:id])
    @spanish_verb_tags = @spanish_verb.card_tags
    @tags = Tag.all.order(:name)
    render 'show.json.jbuilder'
  end

  def update
    @spanish_verb = SpanishVerb.find(params[:id])
    if @spanish_verb.update(spanish_verb_params)
      render 'show.json.jbuilder'
    else
      render json: @spanish_verb.errors.full_messages, status: 422
    end
  end

  def destroy
    spanish_verb = SpanishVerb.find(params[:id])
    spanish_verb.destroy
    render json: spanish_verb
  end

  private

  def spanish_verb_params
    params[:spanish_verb].permit(:english, :spanish)
  end

end
