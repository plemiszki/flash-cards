class Api::HighlightsController < AdminController

  VALID_ENTITY_TYPES = %w[
    Card
    FrenchNoun FrenchVerb FrenchAdjective FrenchMisc FrenchCity FrenchCountry
    SpanishNoun SpanishVerb SpanishAdjective SpanishMisc SpanishCity SpanishCountry
  ].freeze

  def index
    entity = params[:entity]
    unless VALID_ENTITY_TYPES.include?(entity)
      render json: { error: 'invalid entity' }, status: :bad_request and return
    end

    @entity_type = entity
    @highlights = Highlight.where(highlightable_type: entity).includes(:highlightable)
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

  def create
    type = params[:highlight][:highlightable_type]
    unless VALID_ENTITY_TYPES.include?(type)
      render json: { error: 'invalid entity' }, status: :bad_request and return
    end
    klass = type.constantize
    entity = klass.find(params[:highlight][:highlightable_id])
    highlight = Highlight.find_or_create_by!(highlightable: entity)
    render json: highlight
  end

  def destroy
    highlight = Highlight.find(params[:id])
    highlight.destroy
    render json: {}
  end

end
