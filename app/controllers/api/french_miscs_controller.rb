class Api::FrenchMiscsController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @french_miscs = FrenchMisc.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @french_misc = FrenchMisc.new(french_misc_params)
    if @french_misc.save
      if params[:french_misc][:needs_attention] == "true"
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'FrenchMisc', cardtagable_id: @french_misc.id, tag_id: tag_id)
      end
      @french_miscs = FrenchMisc.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_misc)
    end
  end

  def show
    @french_misc = FrenchMisc.find(params[:id])
    @french_misc_tags = @french_misc.card_tags
    @tags = Tag.all.order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @french_misc = FrenchMisc.find(params[:id])
    if @french_misc.update(french_misc_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_misc)
    end
  end

  def destroy
    french_misc = FrenchMisc.find(params[:id])
    french_misc.destroy
    render json: french_misc
  end

  private

  def french_misc_params
    result = params[:french_misc].permit(:english, :french, :streak, :last_streak_add)
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result
  end

end
