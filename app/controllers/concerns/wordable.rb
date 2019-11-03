module Wordable
  extend ActiveSupport::Concern

  def remove_needs_attention
    entity = @noun || @verb || @adjective || @spanish_noun || @spanish_verb || @spanish_adjective
    entity_name = controller_name.camelize[0...-1]
    if entity.streak >= 5
      tag = CardTag.find_by(name: 'Archived', cardtagable_id: entity.id, cardtagable_type: entity_name)
      tag.destroy if tag
    end
  end

end
