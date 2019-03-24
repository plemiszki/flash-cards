import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';
import { StandardIndex, Message } from 'handy-components';

import TabbedIndex from './containers/tabbed-index';
import NewEntity from './containers/new-entity';
import NounDetails from './containers/noun-details';
import VerbDetails from './containers/verb-details';
import AdjectiveDetails from './containers/adjective-details';
import AdverbDetails from './containers/adverb-details';
import CardDetails from './containers/card-details';
import QuizDetails from './containers/quiz-details';
import QuizRun from './containers/quiz-run';
import QuestionDetails from './containers/question-details';
import TagDetails from './containers/tag-details';

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
      <Provider store={ store }>
        <AdverbDetails entityName='adverb' />
      </Provider>,
      document.querySelector('#adverb-details')
    );
  }

  if (document.querySelector('#cards-index')) {
    ReactDOM.render(
      <Provider store={ store }>
        <TabbedIndex
          entityName='card'
          entityNamePlural='cards'
          columns={ ['question', 'tags'] }
          initialNewEntity={ { question: '', answer: '' } }
          modalDimensions={ { width: 900, height: 432 } }
          ellipses={ [80, null] }
          tabs={ ['current', 'archived'] }
          newEntityTab='current'
        />
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
      <Provider store={ store }>
        <QuestionDetails entityName='question' />
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
      <Provider store={ store }>
        <TagDetails entityName='tag' />
      </Provider>,
      document.querySelector('#tag-details')
    );
  }
});
