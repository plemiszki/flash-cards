module RenderErrors

  def render_errors(entity)
    errors_hash = entity.errors.as_json(full_messages: true)
    render json: {
      errors: errors_hash.deep_transform_keys { |k| k.to_s.camelize(:lower) }
    }, status: 422
  end

end
