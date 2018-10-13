import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';

import configureStore from './store/store';
let store = configureStore();

import StandardIndex from './containers/standard-index';
import NounDetails from './containers/noun-details';
import VerbDetails from './containers/verb-details';

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
});
