import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/store';
let store = configureStore();

import NounDetails from './containers/noun-details';

$(document).ready(function() {

  if (document.querySelector("#noun-details")) {
    ReactDOM.render(
      <Provider store={ store }>
        <NounDetails />
      </Provider>,
      document.querySelector("#noun-details")
    );
  }

});
