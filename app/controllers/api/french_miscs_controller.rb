class Api::FrenchMiscsController < AdminController

  include Wordable

  after_action :remove_highlight_if_ready, only: [:update]

  def index
    @french_miscs = FrenchMisc.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @french_misc = FrenchMisc.new(french_misc_params)
    if @french_misc.save
      Highlight.create!(highlightable: @french_misc) if params[:french_misc][:highlight]
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
    result = params[:french_misc].permit(
      :english,
      :french,
      :streak,
      :last_streak_add,
      :streak_freeze_expiration,
      :url,
      :note,
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result.merge!({ streak_freeze_expiration: Time.at(result[:streak_freeze_expiration].to_i) }) if result[:streak_freeze_expiration]
    result
  end

end
