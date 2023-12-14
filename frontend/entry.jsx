import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactModal from 'react-modal'
import { FullIndex, SearchIndex, SearchCriteria, SimpleDetails, Message } from 'handy-components'

import NewEntity from './containers/new-entity'
import SpanishNounDetails from './containers/spanish-noun-details'
import SpanishVerbDetails from './containers/spanish-verb-details'
import SpanishAdjectiveDetails from './containers/spanish-adjective-details'
import SpanishMiscDetails from './containers/spanish-misc-details'
import FrenchNounDetails from './containers/french-noun-details'
import FrenchVerbDetails from './containers/french-verb-details'
import FrenchAdjectiveDetails from './containers/french-adjective-details'
import FrenchMiscDetails from './containers/french-misc-details'
import CardDetails from './containers/card-details'
import QuizDetails from './containers/quiz-details'
import QuizRun from './containers/quiz-run'
import Vocabulary from './containers/vocabulary'

const renderFullIndex = (id, props = {}, args = {}) => {
  const { newEntity: newEntityProps } = args;
  const node = document.getElementById(id);
  if (node) {
    const root = createRoot(node);
    root.render(
      <FullIndex csrfToken={ true } { ...props }>
        { newEntityProps && (<NewEntity { ...newEntityProps } />) }
      </FullIndex>
    );
  }
}

const renderSimpleDetails = (id, props = {}) => {
  const node = document.getElementById(id);
  if (node) {
    const root = createRoot(node);
    root.render(<SimpleDetails csrfToken={ true } { ...props } />);
  }
}

const renderSearchIndex = (id, props = {}, args = {}) => {
  const { searchCriteria: searchCriteriaProps, newEntity: newEntityProps } = args;
  const node = document.getElementById(id);
  if (node) {
    const root = createRoot(node);
    root.render(
      <SearchIndex csrfToken={ true } { ...props }>
        <SearchCriteria { ...searchCriteriaProps } />
        { newEntityProps && (<NewEntity { ...newEntityProps } />) }
      </SearchIndex>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {

  ReactModal.setAppElement(document.body);

  const messageNode = document.getElementById('message');
  if (messageNode) {
    createRoot(messageNode).render(
      <Message />,
    );
  }

  const cardDetailsNode = document.getElementById('card-details');
  if (cardDetailsNode) {
    createRoot(cardDetailsNode).render(
      <CardDetails />
    );
  }

  const quizDetailsNode = document.getElementById('quiz-details');
  if (quizDetailsNode) {
    createRoot(quizDetailsNode).render(
      <QuizDetails />
    );
  }

  const spanishNounNode = document.getElementById('spanish-noun-details');
  if (spanishNounNode) {
    createRoot(spanishNounNode).render(
      <SpanishNounDetails />
    );
  }

  const spanishVerbNode = document.getElementById('spanish-verb-details');
  if (spanishVerbNode) {
    createRoot(spanishVerbNode).render(
      <SpanishVerbDetails />
    );
  }

  const spanishAdjectiveNode = document.getElementById('spanish-adjective-details');
  if (spanishAdjectiveNode) {
    createRoot(spanishAdjectiveNode).render(
      <SpanishAdjectiveDetails />
    );
  }

  const spanishMiscNode = document.getElementById('spanish-misc-details');
  if (spanishMiscNode) {
    createRoot(spanishMiscNode).render(
      <SpanishMiscDetails />
    );
  }

  const frenchNounNode = document.getElementById('french-noun-details');
  if (frenchNounNode) {
    createRoot(frenchNounNode).render(
      <FrenchNounDetails />
    );
  }

  const frenchVerbNode = document.getElementById('french-verb-details');
  if (frenchVerbNode) {
    createRoot(frenchVerbNode).render(
      <FrenchVerbDetails />
    );
  }

  const frenchAdjectiveNode = document.getElementById('french-adjective-details');
  if (frenchAdjectiveNode) {
    createRoot(frenchAdjectiveNode).render(
      <FrenchAdjectiveDetails />
    );
  }

  const frenchMiscNode = document.getElementById('french-misc-details');
  if (frenchMiscNode) {
    createRoot(frenchMiscNode).render(
      <FrenchMiscDetails />
    );
  }

  const quizRunNode = document.getElementById('quiz-run');
  if (quizRunNode) {
    createRoot(quizRunNode).render(
      <QuizRun />
    );
  }

  const vocabularyNode = document.getElementById('vocabulary');
  if (vocabularyNode) {
    createRoot(vocabularyNode).render(
      <Vocabulary />
    );
  }

  renderSearchIndex('cards-index', {
    entityName: 'card',
    columns: [
      { name: 'question' },
      { name: 'tags', width: 300, orderByDisabled: true },
      { name: 'streak', width: 100 },
    ],
    batchSize: 50,
    searchModalRows: 3,
    searchModalDimensions: { width: 600 },
    showNewButton: true,
    newModalDimensions: { width: 900, height: 551 },
  }, {
    searchCriteria: {
      fields: [
        { name: 'question', fuzzy: true, columnWidth: 10 },
        { name: 'answer', fuzzy: true, columnWidth: 10 },
        { name: 'tag', type: 'modal', optionDisplayProperty: 'name', responseArrayName: 'tags', dbName: 'card_tags.tag_id', columnWidth: 8 },
      ],
    },
    newEntity: {
      initialEntity: {
        question: '',
        answer: '',
      },
      redirectAfterCreate: true,
      fetchData: ['tags'],
    }
  });

  renderFullIndex('quizzes-index', {
    entityName: 'quiz',
    entityNamePlural: 'quizzes',
    columns: [
      'name',
      { bold: true, isButton: true, buttonText: 'Run Quiz', clickButton: (quiz) => {
        window.location.pathname = `/quizzes/${quiz.id}/run`
      } },
    ],
    modalRows: 1,
    modalDimensions: { width: 700 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { name: '' },
  }});

  renderFullIndex('tags-index', {
    entityName: 'tag',
    columns: ['name'],
    modalRows: 1,
    modalDimensions: { width: 700 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { name: '' },
  }});

  renderFullIndex('questions-index', {
    entityName: 'question',
    columns: ['name'],
    modalRows: 1,
    modalDimensions: { width: 700 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { name: '' },
  }});

  renderFullIndex('spanish-nouns-index', {
    entityName: 'spanishNoun',
    columns: ['spanish', 'english', 'streak'],
    modalRows: 2,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', englishPlural: '', spanish: '', spanishPlural: '', gender: 1, needsAttention: true },
  }});

  renderFullIndex('french-nouns-index', {
    entityName: 'frenchNoun',
    columns: ['french', 'english', 'streak'],
    modalRows: 2,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', englishPlural: '', french: '', frenchPlural: '', gender: 1, needsAttention: true },
  }});

  renderFullIndex('spanish-verbs-index', {
    entityName: 'spanishVerb',
    columns: ['spanish', 'english', 'streak', 'forms'],
    modalRows: 1,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', spanish: '', needsAttention: true },
  }});

  renderFullIndex('french-verbs-index', {
    entityName: 'frenchVerb',
    columns: ['french', 'english', 'streak', 'forms'],
    modalRows: 1,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', french: '', needsAttention: true },
  }});

  renderFullIndex('spanish-adjectives-index', {
    entityName: 'spanishAdjective',
    columns: [
      { name: 'masculine', header: 'Spanish' },
      { name: 'english' },
      { name: 'streak' },
    ],
    modalRows: 2,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', masculine: '', masculinePlural: '', feminine: '', femininePlural: '', needsAttention: true },
  }});

  renderFullIndex('french-adjectives-index', {
    entityName: 'frenchAdjective',
    columns: [
      { name: 'masculine', header: 'French' },
      { name: 'english' },
      { name: 'streak' },
    ],
    modalRows: 2,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', masculine: '', masculinePlural: '', feminine: '', femininePlural: '', needsAttention: true },
  }});

  renderFullIndex('spanish-miscs-index', {
    entityName: 'spanishMisc',
    columns: ['spanish', 'english'],
    modalRows: 1,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
    header: 'Spanish Miscellaneous Words',
  }, { newEntity: {
    initialEntity: { english: '', spanish: '', needsAttention: true },
  }});

  renderFullIndex('french-miscs-index', {
    entityName: 'frenchMisc',
    columns: ['french', 'english'],
    modalRows: 1,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
    header: 'French Miscellaneous Words',
  }, { newEntity: {
    initialEntity: { english: '', french: '', needsAttention: true },
  }});

  renderFullIndex('french-countries-index', {
    entityName: 'frenchCountry',
    entityNamePlural: 'frenchCountries',
    columns: ['french', 'english', 'gender'],
    modalRows: 1,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
    directory: 'french_countries',
    header: 'French Countries',
  }, { newEntity: {
    initialEntity: { english: '', french: '', needsAttention: true, gender: 1 },
    buttonText: 'Add French Country',
  }});

  renderSimpleDetails('tag-details', {
    entityName: 'tag',
    initialEntity: { name: '' },
    fields: [[
      { columnWidth: 12, property: 'name' },
    ]],
  });

  renderSimpleDetails('question-details', {
    entityName: 'question',
    initialEntity: { name: '' },
    fields: [[
      { columnWidth: 12, property: 'name' },
    ]],
  });
});
