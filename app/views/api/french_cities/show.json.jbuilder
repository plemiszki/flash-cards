json.frenchCity do
  json.id @french_city.id
  json.english @french_city.english
  json.french @french_city.french
  json.streak @french_city.streak
  json.streakFreezeExpiration @french_city.streak_freeze_expiration.to_i || ''
  json.url @french_city.url
end
json.frenchCityTags @french_city_tags do |french_city_tag|
  json.id french_city_tag.id
  json.tagName french_city_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
