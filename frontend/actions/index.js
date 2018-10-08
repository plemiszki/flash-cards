import HandyTools from 'handy-tools';

export function standardCreate(args) {
  return (dispatch) => {
    return $.ajax({
      method: 'POST',
      url: `/api/${args.directory}`,
      data: {
        [args.entityName]: HandyTools.convertObjectKeysToUnderscore(args.entity)
      }
    }).then(
      (response) => dispatch({
        type: 'STANDARD_CREATE',
        entities: response.entities
      }),
      (response) => dispatch({
        type: 'ERRORS',
        errors: response
      })
    );
  }
}

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

export function standardFetchIndex(directory) {
  return (dispatch) => {
    return $.ajax({
      method: 'GET',
      url: `/api/${directory}`
    }).then(
      (response) => dispatch({
        type: 'STANDARD_FETCH_INDEX',
        entities: response.entities
      })
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
