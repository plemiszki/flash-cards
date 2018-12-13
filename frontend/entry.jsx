import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';

import configureStore from './store/store';
let store = configureStore();

import StandardIndex from './containers/standard-index';
import NounDetails from './containers/noun-details';
import VerbDetails from './containers/verb-details';
import AdjectiveDetails from './containers/adjective-details';
import CardDetails from './containers/card-details';
import QuizDetails from './containers/quiz-details';
import QuizRun from './containers/quiz-run';
import QuestionDetails from './containers/question-details';
import TagDetails from './containers/tag-details';

$(document).ready(function() {

  ReactModal.setAppElement(document.body);

  if (document.querySelector('#nouns-index')) {
    ReactDOM.render(
      <Provider store={ store }>
        <StandardIndex
          entityName='noun'
          entityNamePlural='nouns'
          columns={ ['foreign', 'transliterated', 'english'] }
          initialNewEntity={ { english: '', englishPlural: '', foreign: '', foreignPlural: '', gender: 1 } }
          modalRows={ 3 }
          modalDimensions={ { width: 900 } }
        />
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
      <Provider store={ store }>
        <StandardIndex
          entityName='verb'
          entityNamePlural='verbs'
          columns={ ['infinitive', 'transliteratedInfinitive', 'english'] }
          columnHeaders={ ['', 'Transliterated', ''] }
          initialNewEntity={ { english: '', infinitive: '', transliteratedInfinitive: '' } }
          modalDimensions={ { width: 900 } }
        />
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
      <Provider store={ store }>
        <StandardIndex
          entityName='adjective'
          entityNamePlural='adjectives'
          columns={ ['masculine', 'transliteratedMasculine', 'english'] }
          columnHeaders={ ['', 'Transliterated', ''] }
          initialNewEntity={ { english: '', masculine: '', feminine: '' } }
          modalRows={ 3 }
          modalDimensions={ { width: 900 } }
        />
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

  if (document.querySelector('#cards-index')) {
    ReactDOM.render(
      <Provider store={ store }>
        <StandardIndex
          entityName='card'
          entityNamePlural='cards'
          columns={ ['question', 'tags'] }
          initialNewEntity={ { question: '', answer: '' } }
          modalDimensions={ { width: 900, height: 432 } }
          ellipses={ [80, null] }
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
      <Provider store={ store }>
        <StandardIndex
          entityName='quiz'
          entityNamePlural='quizzes'
          columns={ ['name', ''] }
          columnClasses={ ['', 'play-column'] }
          columnLinks={ ['', '/run'] }
          initialNewEntity={ { name: '' } }
          modalDimensions={ { width: 700 } }
        />
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
      <Provider store={ store }>
        <StandardIndex
          entityName='question'
          entityNamePlural='questions'
          columns={ ['name'] }
          initialNewEntity={ { name: '' } }
          modalDimensions={ { width: 700 } }
        />
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
      <Provider store={ store }>
        <StandardIndex
          entityName='tag'
          entityNamePlural='tags'
          columns={ ['name'] }
          initialNewEntity={ { name: '' } }
          modalDimensions={ { width: 500 } }
        />
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
