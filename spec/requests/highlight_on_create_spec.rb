require 'rails_helper'

RSpec.describe 'Highlight created on entity create', type: :request do
  let(:user) { User.create!(email: 'admin@test.com', password: 'password') }
  before { cookies[:remember_token] = user.remember_token }

  shared_examples 'creates a highlight when param is true' do
    context 'when highlight param is true' do
      it 'creates a Highlight record for the entity' do
        expect { post url, params: params_with_highlight }.to change(Highlight, :count).by(1)
        entity = entity_class.last
        expect(Highlight.find_by(highlightable: entity)).not_to be_nil
      end
    end

    context 'when highlight param is false' do
      it 'does not create a Highlight record' do
        expect { post url, params: params_without_highlight }.not_to change(Highlight, :count)
      end
    end
  end

  describe 'Api::NounsController' do
    let(:entity_class) { Noun }
    let(:url) { '/api/nouns' }
    let(:base_params) { { noun: { english: 'dog', english_plural: 'dogs', foreign: 'kutta', foreign_plural: 'kutte', gender: 1 } } }
    let(:params_with_highlight) { base_params.deep_merge(noun: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::VerbsController' do
    let(:entity_class) { Verb }
    let(:url) { '/api/verbs' }
    let(:base_params) { { verb: { english: 'to go', infinitive: 'jaana' } } }
    let(:params_with_highlight) { base_params.deep_merge(verb: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::AdjectivesController' do
    let(:entity_class) { Adjective }
    let(:url) { '/api/adjectives' }
    let(:base_params) { { adjective: { english: 'big', masculine: 'bara', masculine_plural: 'bare', feminine: 'bari' } } }
    let(:params_with_highlight) { base_params.deep_merge(adjective: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::SpanishNounsController' do
    let(:entity_class) { SpanishNoun }
    let(:url) { '/api/spanish_nouns' }
    let(:base_params) { { spanish_noun: { english: 'cat', english_plural: 'cats', spanish: 'gato', spanish_plural: 'gatos', gender: 1 } } }
    let(:params_with_highlight) { base_params.deep_merge(spanish_noun: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::SpanishVerbsController' do
    let(:entity_class) { SpanishVerb }
    let(:url) { '/api/spanish_verbs' }
    let(:base_params) { { spanish_verb: { english: 'to be', spanish: 'ser' } } }
    let(:params_with_highlight) { base_params.deep_merge(spanish_verb: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::SpanishAdjectivesController' do
    let(:entity_class) { SpanishAdjective }
    let(:url) { '/api/spanish_adjectives' }
    let(:base_params) { { spanish_adjective: { english: 'big', masculine: 'grande', masculine_plural: 'grandes', feminine: 'grande', feminine_plural: 'grandes' } } }
    let(:params_with_highlight) { base_params.deep_merge(spanish_adjective: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::SpanishMiscsController' do
    let(:entity_class) { SpanishMisc }
    let(:url) { '/api/spanish_miscs' }
    let(:base_params) { { spanish_misc: { english: 'hello', spanish: 'hola' } } }
    let(:params_with_highlight) { base_params.deep_merge(spanish_misc: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::FrenchNounsController' do
    let(:entity_class) { FrenchNoun }
    let(:url) { '/api/french_nouns' }
    let(:base_params) { { french_noun: { english: 'cat', english_plural: 'cats', french: 'chat', french_plural: 'chats', gender: 1 } } }
    let(:params_with_highlight) { base_params.deep_merge(french_noun: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::FrenchVerbsController' do
    let(:entity_class) { FrenchVerb }
    let(:url) { '/api/french_verbs' }
    let(:base_params) { { french_verb: { english: 'to go', french: 'aller' } } }
    let(:params_with_highlight) { base_params.deep_merge(french_verb: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::FrenchAdjectivesController' do
    let(:entity_class) { FrenchAdjective }
    let(:url) { '/api/french_adjectives' }
    let(:base_params) { { french_adjective: { english: 'big', masculine: 'grand', masculine_plural: 'grands', feminine: 'grande', feminine_plural: 'grandes' } } }
    let(:params_with_highlight) { base_params.deep_merge(french_adjective: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::FrenchMiscsController' do
    let(:entity_class) { FrenchMisc }
    let(:url) { '/api/french_miscs' }
    let(:base_params) { { french_misc: { english: 'hello', french: 'bonjour' } } }
    let(:params_with_highlight) { base_params.deep_merge(french_misc: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::FrenchCitiesController' do
    let(:entity_class) { FrenchCity }
    let(:url) { '/api/french_cities' }
    let(:base_params) { { french_city: { english: 'Paris', french: 'Paris' } } }
    let(:params_with_highlight) { base_params.deep_merge(french_city: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end

  describe 'Api::FrenchCountriesController' do
    let(:entity_class) { FrenchCountry }
    let(:url) { '/api/french_countries' }
    let(:base_params) { { french_country: { english: 'France', french: 'France', gender: 2 } } }
    let(:params_with_highlight) { base_params.deep_merge(french_country: { highlight: true }) }
    let(:params_without_highlight) { base_params }
    include_examples 'creates a highlight when param is true'
  end
end
