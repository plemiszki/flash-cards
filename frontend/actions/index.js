import HandyTools from 'handy-tools';

export function standardDelete(directory, id) {
  return (dispatch) => {
    return $.ajax({
      method: 'DELETE',
      url: `/api/nouns/${id}`
    }).then(
      () => {
        window.location.pathname = `/${directory}`;
      }
    );
  }
}

export function fetchNoun(id) {
  return (dispatch) => {
    return $.ajax({
      method: 'GET',
      url: `/api/nouns/${id}`
    }).then(
      (response) => dispatch({
        type: 'FETCH_NOUN',
        noun: response.noun
      })
    );
  }
}

export function updateNoun(id, noun) {
  return (dispatch) => {
    return $.ajax({
      method: 'PATCH',
      url: `/api/nouns/${id}`,
      data: {
        noun: HandyTools.convertObjectKeysToUnderscore(noun)
      }
    }).then(
      (response) => dispatch({
        type: 'UPDATE_NOUN',
        noun: response.noun
      }),
      (response) => dispatch({
        type: 'ERRORS',
        errors: response
      })
    );
  }
}
