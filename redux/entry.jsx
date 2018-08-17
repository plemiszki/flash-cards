import React from 'react';
import ReactDOM from 'react-dom';

import NounDetails from './containers/noun-details';

$(document).ready(function() {

  if ($('#noun-details')[0]) {
    ReactDOM.render(<NounDetails />, document.getElementById("noun-details"));
  }

});
