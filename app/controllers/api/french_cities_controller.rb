class Api::FrenchCitiesController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @french_cities = FrenchCity.all
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    @french_city = FrenchCity.new(french_city_params)
    if @french_city.save
      if params[:french_city][:needs_attention] == true
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'FrenchCity', cardtagable_id: @french_city.id, tag_id: tag_id)
      end
      @french_cities = FrenchCity.all
      render 'index', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_city)
    end
  end

  def show
    @french_city = FrenchCity.find(params[:id])
    @french_city_tags = @french_city.card_tags
    @tags = Tag.all.order(:name)
    render 'show', formats: [:json], handlers: [:jbuilder]
  end

  def update
    @french_city = FrenchCity.find(params[:id])
    if @french_city.update(french_city_params)
      render 'show', formats: [:json], handlers: [:jbuilder]
    else
      render_errors(@french_city)
    end
  end

  def destroy
    french_city = FrenchCity.find(params[:id])
    french_city.destroy
    render json: french_city
  end

  private

  def french_city_params
    result = params[:french_city].permit(
      :english,
      :french,
      :streak,
      :last_streak_add,
      :streak_freeze_expiration,
    )
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result.merge!({ streak_freeze_expiration: Time.at(result[:streak_freeze_expiration].to_i) }) if result[:streak_freeze_expiration]
    result
  end

end
