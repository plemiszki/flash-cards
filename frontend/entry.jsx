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
          modalDimensions={ { width: 900, height: 478 } }
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
          columns={ ['infinitive', 'english'] }
          initialNewEntity={ { english: '', infinitive: '' } }
          modalDimensions={ { width: 900, height: 240 } }
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
          columns={ ['masculine', 'feminine', 'english'] }
          initialNewEntity={ { english: '', masculine: '', feminine: '' } }
          modalDimensions={ { width: 900, height: 240 } }
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
          columns={ ['question', 'answer'] }
          initialNewEntity={ { question: '', answer: '' } }
          modalDimensions={ { width: 900, height: 359 } }
        />
      </Provider>,
      document.querySelector('#cards-index')
    );
  }

  if (document.querySelector('#card-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <CardDetails entityName='card' />
      </Provider>,
      document.querySelector('#card-details')
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
          modalDimensions={ { width: 500, height: 240 } }
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
