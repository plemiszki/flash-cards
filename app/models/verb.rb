class Verb < ActiveRecord::Base

  validates_presence_of :english, :infinitive
  validates_uniqueness_of :english, scope: :infinitive, message: '/ Hindi combo already used'

  def hindi_stem
    infinitive[0...-2]
  end

  def hindi_informal
    if irregular_imperative_informal.empty?
      ["ा", "आ"].include?(hindi_stem[-1]) ? "#{hindi_stem}ओ" : "#{hindi_stem}ो"
    else
      irregular_imperative_informal
    end
  end

  def hindi_formal
    if irregular_imperative_formal.empty?
      ["ा", "आ"].include?(hindi_stem[-1]) ? "#{hindi_stem}इए" : "#{hindi_stem}िए"
    else
      irregular_imperative_formal
    end
  end

  def transliterated_stem
    transliterated_infinitive[0...-2]
  end

  def transliterated_informal
    if irregular_imperative_informal_transliterated.empty?
      "#{transliterated_stem}o"
    else
      irregular_imperative_informal_transliterated
    end
  end

  def transliterated_formal
    if irregular_imperative_formal_transliterated.empty?
      "#{transliterated_stem}ie"
    else
      irregular_imperative_formal_transliterated
    end
  end

end
