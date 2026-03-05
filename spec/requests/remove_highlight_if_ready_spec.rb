require 'rails_helper'

RSpec.describe 'remove_highlight_if_ready after_action', type: :request do
  let(:user) { User.create!(email: 'admin@test.com', password: 'password') }
  before { cookies[:remember_token] = user.remember_token }

  shared_examples 'destroys highlight when streak reaches 5' do
    context 'when streak is updated to 5' do
      it 'destroys the highlight' do
        Highlight.create!(highlightable: entity)
        patch url, params: { param_key => { streak: 5 } }
        expect(Highlight.find_by(highlightable: entity)).to be_nil
      end
    end

    context 'when streak is below 5' do
      it 'keeps the highlight' do
        Highlight.create!(highlightable: entity)
        patch url, params: { param_key => { streak: 4 } }
        expect(Highlight.find_by(highlightable: entity)).not_to be_nil
      end
    end
  end

  describe 'Api::CardsController' do
    let(:entity) { Card.create!(question: 'Q', answer: 'A', config: {}) }
    let(:url) { "/api/cards/#{entity.id}" }
    let(:param_key) { :card }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::NounsController' do
    let(:entity) { Noun.create!(english: 'dog', english_plural: 'dogs', foreign: 'kutta', foreign_plural: 'kutte', gender: 1) }
    let(:url) { "/api/nouns/#{entity.id}" }
    let(:param_key) { :noun }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::VerbsController' do
    let(:entity) { Verb.create!(english: 'to go', infinitive: 'jaana') }
    let(:url) { "/api/verbs/#{entity.id}" }
    let(:param_key) { :verb }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::AdjectivesController' do
    let(:entity) { Adjective.create!(english: 'big', masculine: 'bara', masculine_plural: 'bare', feminine: 'bari') }
    let(:url) { "/api/adjectives/#{entity.id}" }
    let(:param_key) { :adjective }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::SpanishNounsController' do
    let(:entity) { SpanishNoun.create!(english: 'cat', english_plural: 'cats', spanish: 'gato', spanish_plural: 'gatos', gender: 1) }
    let(:url) { "/api/spanish_nouns/#{entity.id}" }
    let(:param_key) { :spanish_noun }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::SpanishVerbsController' do
    let(:entity) { SpanishVerb.create!(english: 'to be', spanish: 'ser') }
    let(:url) { "/api/spanish_verbs/#{entity.id}" }
    let(:param_key) { :spanish_verb }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::SpanishAdjectivesController' do
    let(:entity) { SpanishAdjective.create!(english: 'big', masculine: 'grande', masculine_plural: 'grandes', feminine: 'grande', feminine_plural: 'grandes') }
    let(:url) { "/api/spanish_adjectives/#{entity.id}" }
    let(:param_key) { :spanish_adjective }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::SpanishMiscsController' do
    let(:entity) { SpanishMisc.create!(english: 'hello', spanish: 'hola') }
    let(:url) { "/api/spanish_miscs/#{entity.id}" }
    let(:param_key) { :spanish_misc }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::FrenchNounsController' do
    let(:entity) { FrenchNoun.create!(english: 'cat', english_plural: 'cats', french: 'chat', french_plural: 'chats', gender: 1) }
    let(:url) { "/api/french_nouns/#{entity.id}" }
    let(:param_key) { :french_noun }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::FrenchVerbsController' do
    let(:entity) { FrenchVerb.create!(english: 'to go', french: 'aller') }
    let(:url) { "/api/french_verbs/#{entity.id}" }
    let(:param_key) { :french_verb }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::FrenchAdjectivesController' do
    let(:entity) { FrenchAdjective.create!(english: 'big', masculine: 'grand', masculine_plural: 'grands', feminine: 'grande', feminine_plural: 'grandes') }
    let(:url) { "/api/french_adjectives/#{entity.id}" }
    let(:param_key) { :french_adjective }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::FrenchMiscsController' do
    let(:entity) { FrenchMisc.create!(english: 'hello', french: 'bonjour') }
    let(:url) { "/api/french_miscs/#{entity.id}" }
    let(:param_key) { :french_misc }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::FrenchCitiesController' do
    let(:entity) { FrenchCity.create!(english: 'Paris', french: 'Paris') }
    let(:url) { "/api/french_cities/#{entity.id}" }
    let(:param_key) { :french_city }
    include_examples 'destroys highlight when streak reaches 5'
  end

  describe 'Api::FrenchCountriesController' do
    let(:entity) { FrenchCountry.create!(english: 'France', french: 'France', gender: 2) }
    let(:url) { "/api/french_countries/#{entity.id}" }
    let(:param_key) { :french_country }
    include_examples 'destroys highlight when streak reaches 5'
  end
end
