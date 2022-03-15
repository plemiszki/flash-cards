class Api::SpanishMiscsController < AdminController

  include Wordable

  after_action :remove_needs_attention, only: [:update]

  def index
    @spanish_miscs = SpanishMisc.all
  end

  def create
    @spanish_misc = SpanishMisc.new(spanish_misc_params)
    if @spanish_misc.save
      if params[:spanish_misc][:needs_attention] == "true"
        tag_id = Tag.find_by_name('Needs Attention').id
        CardTag.create(cardtagable_type: 'SpanishMisc', cardtagable_id: @spanish_misc.id, tag_id: tag_id)
      end
      @spanish_miscs = SpanishMisc.all
      render 'index'
    else
      render json: @spanish_misc.errors.full_messages, status: 422
    end
  end

  def show
    @spanish_misc = SpanishMisc.find(params[:id])
    @spanish_misc_tags = @spanish_misc.card_tags
    @tags = Tag.all.order(:name)
  end

  def update
    @spanish_misc = SpanishMisc.find(params[:id])
    if @spanish_misc.update(spanish_misc_params)
      render 'show'
    else
      render json: @spanish_misc.errors.full_messages, status: 422
    end
  end

  def destroy
    spanish_misc = SpanishMisc.find(params[:id])
    spanish_misc.destroy
    render json: spanish_misc
  end

  private

  def spanish_misc_params
    result = params[:spanish_misc].permit(:english, :spanish, :streak, :last_streak_add)
    result.merge!({ last_streak_add: Time.at(result[:last_streak_add].to_i).to_date }) if result[:last_streak_add]
    result
  end

end
