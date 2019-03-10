class Verb < ActiveRecord::Base

  validates_presence_of :english, :infinitive
  validates_uniqueness_of :english, scope: :infinitive, message: '/ Hindi combo already used'

  def hindi_stem
    infinitive[0...-2]
  end

  def hindi_informal
    ["ा", "आ"].include?(hindi_stem[-1]) ? "#{hindi_stem}ओ" : "#{hindi_stem}ो"
  end

  def hindi_formal
    ["ा", "आ"].include?(hindi_stem[-1]) ? "#{hindi_stem}इए" : "#{hindi_stem}िए"
  end

  def transliterated_stem
    transliterated_infinitive[0...-2]
  end

  def transliterated_informal
    "#{transliterated_stem}o"
  end

  def transliterated_formal
    "#{transliterated_stem}ie"
  end

end
