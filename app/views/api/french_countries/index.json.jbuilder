json.frenchCountries @french_countries do |french_country|
  json.id french_country.id
  json.french french_country.french
  json.english french_country.english
  json.gender french_country.male? ? 'Male' : 'Female'
end
