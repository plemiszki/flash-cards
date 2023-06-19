class Api::NounsController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @nouns = Noun.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @noun = Noun.new(noun_params)
    if @noun.save
      if params[:noun][:needs_attention] == true
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'Noun', cardtagable_id: @noun.id, tag_id: tag_id)
      end
      @nouns = Noun.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render json: @noun.errors.full_messages, status: 422
    end
  end

  def show
    @noun = Noun.find(params[:id])
    @noun_tags = @noun.card_tags
    @tags = Tag.all.order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @noun = Noun.find(params[:id])
    if @noun.update(noun_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render json: @noun.errors.full_messages, status: 422
    end
  end

  def destroy
    noun = Noun.find(params[:id])
    noun.destroy
    render json: noun
  end

  private

  def noun_params
    result = params[:noun].permit(:english, :english_plural, :foreign, :foreign_plural, :gender, :transliterated, :transliterated_plural, :uncountable, :streak, :last_streak_add)
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result
  end

end
