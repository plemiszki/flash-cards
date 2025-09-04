source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

ruby '3.4.5'

gem 'rails', '8.0.2.1'
gem 'pg'

gem 'activerecord_json_validator'
gem 'bootstrap-sass'
gem 'clearance', '~> 2.5'
gem 'cloudinary'
gem 'dotenv'
gem 'filestack-rails'
gem 'httparty'
gem 'jbuilder'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'pry-rails'
gem 'puma'
gem 'sassc-rails'
gem 'sidekiq'
gem 'uglifier'

group :development, :test do
  gem 'dotenv-rails'
end

group :development do
  gem 'listen'
end

group :production do
  gem 'rails_12factor'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
