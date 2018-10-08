import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';

import configureStore from './store/store';
let store = configureStore();

import StandardIndex from './containers/standard-index';
import NounDetails from './containers/noun-details';

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
});
