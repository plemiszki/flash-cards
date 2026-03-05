class Api::FrenchCountriesController < AdminController

  include Wordable

  after_action :remove_highlight_if_ready, only: [:update]

  def index
    @french_countries = FrenchCountry.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @french_country = FrenchCountry.new(french_country_params)
    if @french_country.save
      Highlight.create!(highlightable: @french_country) if params[:french_country][:highlight]
      @french_countries = FrenchCountry.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_country)
    end
  end

  def show
    @french_country = FrenchCountry.find(params[:id])
    @french_country_tags = @french_country.card_tags
    @tags = Tag.all.order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @french_country = FrenchCountry.find(params[:id])
    if @french_country.update(french_country_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_country)
    end
  end

  def destroy
    french_country = FrenchCountry.find(params[:id])
    french_country.destroy
    render json: french_country
  end

  private

  def french_country_params
    result = params[:french_country].permit(
      :english,
      :french,
      :gender,
      :streak,
      :last_streak_add,
      :streak_freeze_expiration,
      :url,
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result.merge!({ streak_freeze_expiration: Time.at(result[:streak_freeze_expiration].to_i) }) if result[:streak_freeze_expiration]
    result
  end

end
