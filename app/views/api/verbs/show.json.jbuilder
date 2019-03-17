json.entity do
  json.id @verb.id
  json.english @verb.english
  json.infinitive @verb.infinitive
  json.transliteratedInfinitive @verb.transliterated_infinitive
  json.irregularImperativeInformal @verb.irregular_imperative_informal
  json.irregularImperativeFormal @verb.irregular_imperative_formal
  json.irregularImperativeInformalTransliterated @verb.irregular_imperative_informal_transliterated
  json.irregularImperativeFormalTransliterated @verb.irregular_imperative_formal_transliterated
  json.postposition @verb.postposition
end
