json.verb do
  json.id @verb.id
  json.english @verb.english
  json.englishIrregularImperfective @verb.english_irregular_imperfective
  json.infinitive @verb.infinitive
  json.transliteratedInfinitive @verb.transliterated_infinitive
  json.irregularImperativeInformal @verb.irregular_imperative_informal
  json.irregularImperativeFormal @verb.irregular_imperative_formal
  json.irregularImperativeInformalTransliterated @verb.irregular_imperative_informal_transliterated
  json.irregularImperativeFormalTransliterated @verb.irregular_imperative_formal_transliterated
  json.postposition @verb.postposition
  json.englishPreposition @verb.english_preposition
end
json.verbTags @verb_tags do |verb_tag|
  json.id verb_tag.id
  json.tagName verb_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
