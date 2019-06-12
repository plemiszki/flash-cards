import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';
import { SimpleDetails, StandardIndex, TabbedIndex, Message } from 'handy-components';

import NewEntity from './containers/new-entity';
import NounDetails from './containers/noun-details';
import SpanishNounDetails from './containers/spanish-noun-details';
import VerbDetails from './containers/verb-details';
import AdjectiveDetails from './containers/adjective-details';
import CardDetails from './containers/card-details';
import QuizDetails from './containers/quiz-details';
import QuizRun from './containers/quiz-run';

import TabActions from './containers/modules/tab-actions.js';

import configureStore from './store/store';
let store = configureStore();

$(document).ready(function() {

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
        <StandardIndex
          context={ MyContext }
          entityName='noun'
          columns={ ['foreign', 'transliterated', 'english'] }
          modalRows={ 3 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', englishPlural: '', foreign: '', foreignPlural: '', gender: 1 } }
          />
        </StandardIndex>
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
        <StandardIndex
          context={ MyContext }
          entityName='verb'
          columns={ ['infinitive', 'transliteratedInfinitive', 'english'] }
          columnHeaders={ ['', 'Transliterated', ''] }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', infinitive: '', transliteratedInfinitive: '' } }
          />
        </StandardIndex>
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
        <StandardIndex
          context={ MyContext }
          entityName='adjective'
          columns={ ['masculine', 'transliteratedMasculine', 'english'] }
          columnHeaders={ ['', 'Transliterated', ''] }
          modalDimensions={ { width: 900 } }
          modalRows={ 3 }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', masculine: '', feminine: '' } }
          />
        </StandardIndex>
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
        <StandardIndex
          context={ MyContext }
          entityName='adverb'
          columns={ ['foreign', 'transliterated', 'english'] }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { foreign: '', transliterated: '', english: '' } }
          />
        </StandardIndex>
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
          initialEntity={ { name: '' } }
          fields={ [[
            { columnWidth: 4, entity: 'adverb', property: 'foreign' },
            { columnWidth: 4, entity: 'adverb', property: 'transliterated' },
            { columnWidth: 4, entity: 'adverb', property: 'english' }
          ]] }
        />
      </Provider>,
      document.querySelector('#adverb-details')
    );
  }

  if (document.querySelector('#cards-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <TabbedIndex
          context={ MyContext }
          entityName='card'
          columns={ ['question', 'tags'] }
          modalDimensions={ { width: 900, height: 432 } }
          ellipses={ [80, null] }
          tabs={ ['current', 'archived'] }
          newEntityTab='current'
          tabActions={ TabActions }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { question: '', answer: '' } }
          />
        </TabbedIndex>
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
        <StandardIndex
          context={ MyContext }
          entityName='quiz'
          entityNamePlural='quizzes'
          columns={ ['name', ''] }
          columnClasses={ ['', 'play-column'] }
          columnLinks={ ['', '/run'] }
          modalDimensions={ { width: 700 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { name: '' } }
          />
        </StandardIndex>
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
        <StandardIndex
          context={ MyContext }
          entityName='question'
          columns={ ['name'] }
          modalDimensions={ { width: 700 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { name: '' } }
          />
        </StandardIndex>
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
        />
      </Provider>,
      document.querySelector('#question-details')
    );
  }

  if (document.querySelector('#tags-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <StandardIndex
          context={ MyContext }
          entityName='tag'
          columns={ ['name'] }
          modalDimensions={ { width: 500 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { name: '' } }
          />
        </StandardIndex>
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
        />
      </Provider>,
      document.querySelector('#tag-details')
    );
  }

  if (document.querySelector('#spanish-nouns-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <StandardIndex
          context={ MyContext }
          entityName='spanishNoun'
          columns={ ['spanish', 'english'] }
          modalRows={ 2 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', englishPlural: '', spanish: '', spanishPlural: '', gender: 1 } }
          />
        </StandardIndex>
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
        <StandardIndex
          context={ MyContext }
          entityName='spanishVerb'
          columns={ ['spanish', 'english'] }
          modalRows={ 1 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', spanish: '' } }
          />
        </StandardIndex>
      </Provider>,
      document.querySelector('#spanish-verbs-index')
    );
  }

  if (document.querySelector('#spanish-verb-details')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <SimpleDetails
          context={ MyContext }
          entityName='spanishVerb'
          initialEntity={ { english: '', spanish: '' } }
          fields={
            [
              [
                { columnWidth: 6, entity: 'spanishVerb', property: 'english' },
                { columnWidth: 6, entity: 'spanishVerb', property: 'spanish' }
              ]
            ]
          }
        />
      </Provider>,
      document.querySelector('#spanish-verb-details')
    );
  }

  if (document.querySelector('#spanish-adjectives-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <StandardIndex
          context={ MyContext }
          entityName='spanishAdjective'
          columns={ ['masculine', 'english'] }
          modalRows={ 2 }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { english: '', masculine: '', masculinePlural: '', feminine: '', femininePlural: '' } }
          />
        </StandardIndex>
      </Provider>,
      document.querySelector('#spanish-adjectives-index')
    );
  }

  if (document.querySelector('#spanish-adjective-details')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <SimpleDetails
          context={ MyContext }
          entityName='spanishAdjective'
          initialEntity={ { english: '', masculine: '', feminine: '', masculinePlural: '', femininePlural: '' } }
          fields={
            [
              [
                { columnWidth: 6, entity: 'spanishAdjective', property: 'english' },
                { columnWidth: 6, entity: 'spanishAdjective', property: 'masculine' },
                { columnWidth: 6, entity: 'spanishAdjective', property: 'feminine' },
                { columnWidth: 6, entity: 'spanishAdjective', property: 'masculinePlural' },
                { columnWidth: 6, entity: 'spanishAdjective', property: 'femininePlural' }
              ]
            ]
          }
        />
      </Provider>,
      document.querySelector('#spanish-adjective-details')
    );
  }
});
