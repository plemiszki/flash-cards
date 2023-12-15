module Wordable
  extend ActiveSupport::Concern

  def remove_needs_attention
    entity = @noun || @verb || @adjective || @spanish_noun || @spanish_verb || @spanish_adjective || @spanish_misc || @french_noun || @french_verb || @french_adjective || @french_city || @french_country || @french_misc
    entity_name = controller_name.camelize[0...-1]
    if entity.streak >= 5
      needs_attention_tag_id = Tag.find_by(name: 'Needs Attention')
      tag = CardTag.find_by(tag_id: needs_attention_tag_id, cardtagable_id: entity.id, cardtagable_type: entity_name)
      tag.destroy if tag
    end
  end

end
