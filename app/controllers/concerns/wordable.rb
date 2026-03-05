module Wordable
  extend ActiveSupport::Concern

  def remove_highlight_if_ready
    entity = @noun || @verb || @adjective || @spanish_noun || @spanish_verb || @spanish_adjective || @spanish_misc || @french_noun || @french_verb || @french_adjective || @french_city || @french_country || @french_misc
    if entity.streak >= 5
      highlight = Highlight.find_by(highlightable: entity)
      highlight.destroy if highlight
    end
  end

end
