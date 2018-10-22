json.quiz do
  json.name @quiz.name
  json.questions @quiz.run.map { |element| element.transform_keys { |key| key.to_s.camelize(:lower) } }
end
