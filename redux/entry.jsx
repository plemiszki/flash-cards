import React from 'react';
import ReactDOM from 'react-dom';

import NounDetails from './containers/noun-details';

$(document).ready(function() {
  console.log('we are here!');

  if ($('#noun-details')[0]) {
    ReactDOM.render(<NounDetails />, document.getElementById("noun-details"));
  }

});
