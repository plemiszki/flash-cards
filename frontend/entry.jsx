import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/store';
let store = configureStore();

import StandardIndex from './containers/standard-index';
import NounDetails from './containers/noun-details';

$(document).ready(function() {

  if (document.querySelector('#noun-details')) {
    ReactDOM.render(
      <Provider store={ store }>
        <NounDetails />
      </Provider>,
      document.querySelector('#noun-details')
    );
  }

  if (document.querySelector('#nouns-index')) {
    ReactDOM.render(
      <Provider store={ store }>
        <StandardIndex entityNamePlural='Nouns' columns={ ['foreign', 'transliterated', 'english'] } />
      </Provider>,
      document.querySelector('#nouns-index')
    );
  }

});
