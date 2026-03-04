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

    @highlights = Highlight.where(highlightable_type: entity).includes(:highlightable)
    render 'index', formats: [:json], handlers: [:jbuilder]
  end

end
