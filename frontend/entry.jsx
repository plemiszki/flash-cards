import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import ReactModal from 'react-modal'
import { FullIndex, SearchIndex, SearchCriteria, SimpleDetails, Message } from 'handy-components'

import NewEntity from './containers/new-entity'
import NounDetails from './containers/noun-details'
import VerbDetails from './containers/verb-details'
import AdjectiveDetails from './containers/adjective-details'
import SpanishNounDetails from './containers/spanish-noun-details'
import SpanishVerbDetails from './containers/spanish-verb-details'
import SpanishAdjectiveDetails from './containers/spanish-adjective-details'
import SpanishMiscDetails from './containers/spanish-misc-details'
import CardDetails from './containers/card-details'
import QuizDetails from './containers/quiz-details'
import QuizRun from './containers/quiz-run'
import Vocabulary from './containers/vocabulary'

import TabActions from './containers/modules/tab-actions.js'

import configureStore from './store/store'
let store = configureStore();

document.addEventListener('DOMContentLoaded', () => {

  ReactModal.setAppElement(document.body);
  const MyContext = React.createContext();

  if (document.querySelector('#message')) {
    ReactDOM.render(
      <Message />,
      document.querySelector('#message')
    );
  }

  if (document.querySelector('#nouns-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='noun'
          columns={ ['foreign', 'transliterated', 'english', 'streak'] }
          modalRows={ 3 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', englishPlural: '', foreign: '', foreignPlural: '', gender: 1, needsAttention: true } }
          />
        </FullIndex>
      </Provider>,
      document.querySelector('#nouns-index')
    );
  }

  if (document.querySelector('#noun-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <NounDetails />
      </Provider>,
      document.querySelector('#noun-details')
    );
  }

  if (document.querySelector('#verbs-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='verb'
          columns={ ['infinitive', 'transliteratedInfinitive', 'english', 'streak'] }
          columnHeaders={ ['', 'Transliterated', ''] }
          modalDimensions={ { width: 1100 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', infinitive: '', transliteratedInfinitive: '', needsAttention: true } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#verbs-index')
    );
  }

  if (document.querySelector('#verb-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <VerbDetails entityName='verb' />
      </Provider>,
      document.querySelector('#verb-details')
    );
  }

  if (document.querySelector('#adjectives-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='adjective'
          columns={ ['masculine', 'transliteratedMasculine', 'english', 'streak'] }
          columnHeaders={ ['', 'Transliterated', ''] }
          modalDimensions={ { width: 900 } }
          modalRows={ 3 }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', masculine: '', feminine: '', needsAttention: true } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#adjectives-index')
    );
  }

  if (document.querySelector('#adjective-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <AdjectiveDetails entityName='adjective' />
      </Provider>,
      document.querySelector('#adjective-details')
    );
  }

  if (document.querySelector('#adverbs-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='adverb'
          columns={ ['foreign', 'transliterated', 'english'] }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { foreign: '', transliterated: '', english: '' } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#adverbs-index')
    );
  }

  if (document.querySelector('#adverb-details')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <SimpleDetails
          context={ MyContext }
          entityName='adverb'
          initialEntity={ {} }
          fields={ [[
            { columnWidth: 4, entity: 'adverb', property: 'foreign' },
            { columnWidth: 4, entity: 'adverb', property: 'transliterated' },
            { columnWidth: 4, entity: 'adverb', property: 'english' }
          ]] }
          csrfToken={ true }
        />
      </Provider>,
      document.querySelector('#adverb-details')
    );
  }

  if (document.querySelector('#cards-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <SearchIndex
          context={ MyContext }
          entityName='card'
          columns={[
            { name: 'question' },
            { name: 'tags', width: 300 },
            { name: 'streak', width: 100 }
          ]}
          batchSize={ 50 }
          searchModalRows={ 2 }
          searchModalDimensions={ { width: 600 } }
          showNewButton={ true }
          newModalDimensions={ { width: 900, height: 432 } }
        >
          <SearchCriteria
            context={ MyContext }
            fields={[
              { name: 'question', fuzzy: true, columnWidth: 10 },
              { name: 'answer', fuzzy: true, columnWidth: 10 }
            ]}
          />
          <NewEntity
            context={ MyContext }
            initialEntity={ { question: '', answer: '' } }
            redirect={ true }
          />
        </SearchIndex>
      </Provider>,
      document.querySelector('#cards-index')
    );
  }

  if (document.querySelector('#card-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <CardDetails entityName='card' array1Name='cardTags' array2Name='tags' />
      </Provider>,
      document.querySelector('#card-details')
    );
  }

  if (document.querySelector('#quizzes-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='quiz'
          entityNamePlural='quizzes'
          columns={[
            { name: 'name' },
            { name: '', classes: 'play-column', links: '/run' }
          ]}
          modalDimensions={ { width: 700 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { name: '' } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#quizzes-index')
    );
  }

  if (document.querySelector('#quiz-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <QuizDetails entityName='quiz' array1Name='quizQuestions' array2Name='questions' array3Name='tags' />
      </Provider>,
      document.querySelector('#quiz-details')
    );
  }

  if (document.querySelector('#quiz-run')) {
    ReactDOM.render(
      <Provider store={ store }>
        <QuizRun entityName='quiz' />
      </Provider>,
      document.querySelector('#quiz-run')
    );
  }

  if (document.querySelector('#questions-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='question'
          columns={ ['name'] }
          modalDimensions={ { width: 700 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { name: '' } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#questions-index')
    );
  }

  if (document.querySelector('#question-details')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <SimpleDetails
          context={ MyContext }
          entityName='question'
          initialEntity={ { name: '' } }
          fields={ [[{ columnWidth: 6, entity: 'question', property: 'name' }]] }
          csrfToken={ true }
        />
      </Provider>,
      document.querySelector('#question-details')
    );
  }

  if (document.querySelector('#tags-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='tag'
          columns={ ['name'] }
          modalDimensions={ { width: 500 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { name: '' } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#tags-index')
    );
  }

  if (document.querySelector('#tag-details')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <SimpleDetails
          context={ MyContext }
          entityName='tag'
          initialEntity={ { name: '' } }
          fields={ [[{ columnWidth: 6, entity: 'tag', property: 'name' }]] }
          csrfToken={ true }
        />
      </Provider>,
      document.querySelector('#tag-details')
    );
  }

  if (document.querySelector('#spanish-nouns-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='spanishNoun'
          columns={ ['spanish', 'english', 'streak'] }
          modalRows={ 2 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', englishPlural: '', spanish: '', spanishPlural: '', gender: 1, needsAttention: true } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#spanish-nouns-index')
    );
  }

  if (document.querySelector('#spanish-noun-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <SpanishNounDetails />
      </Provider>,
      document.querySelector('#spanish-noun-details')
    );
  }

  if (document.querySelector('#spanish-verbs-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='spanishVerb'
          columns={ ['spanish', 'english', 'streak'] }
          modalRows={ 1 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', spanish: '', needsAttention: true } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#spanish-verbs-index')
    );
  }

  if (document.querySelector('#spanish-verb-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <SpanishVerbDetails />
      </Provider>,
      document.querySelector('#spanish-verb-details')
    );
  }

  if (document.querySelector('#spanish-adjectives-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          entityName='spanishAdjective'
          columns={ ['masculine', 'english', 'streak'] }
          modalRows={ 2 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', masculine: '', masculinePlural: '', feminine: '', femininePlural: '', needsAttention: true } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#spanish-adjectives-index')
    );
  }

  if (document.querySelector('#spanish-adjective-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <SpanishAdjectiveDetails />
      </Provider>,
      document.querySelector('#spanish-adjective-details')
    );
  }

  if (document.querySelector('#spanish-miscs-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <FullIndex
          context={ MyContext }
          header='Spanish Miscellaneous Words'
          entityName='spanishMisc'
          columns={ ['spanish', 'english'] }
          modalRows={ 1 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', spanish: '', needsAttention: true } }
          />
      </FullIndex>
      </Provider>,
      document.querySelector('#spanish-miscs-index')
    );
  }

  if (document.querySelector('#spanish-misc-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <SpanishMiscDetails />
      </Provider>,
      document.querySelector('#spanish-misc-details')
    );
  }

  if (document.querySelector('#vocabulary')) {
    ReactDOM.render(
      <Provider store={ store }>
        <Vocabulary />
      </Provider>,
      document.querySelector('#vocabulary')
    );
  }
});
