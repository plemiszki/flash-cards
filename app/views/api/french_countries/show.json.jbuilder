json.frenchCountry do
  json.id @french_country.id
  json.english @french_country.english
  json.french @french_country.french
  json.streak @french_country.streak
  json.streakFreezeExpiration @french_country.streak_freeze_expiration.to_i || ''
end
json.frenchCountryTags @french_country_tags do |french_country_tag|
  json.id french_country_tag.id
  json.tagName french_country_tag.tag.name
end
json.tags @tags do |tag|
  json.id tag.id
  json.name tag.name
end
