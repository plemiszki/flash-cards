import HandyTools from 'handy-tools';

export function fetchEntities(directory) {
  return (dispatch) => {
    return $.ajax({
      method: 'GET',
      url: `/api/${directory}`
    }).then(
      (response) => dispatch({
        type: 'FETCH_ENTITIES',
        entities: response.entities
      })
    );
  }
}

export function createEntity(args) {
  return (dispatch) => {
    return $.ajax({
      method: 'POST',
      url: `/api/${args.directory}`,
      data: {
        [HandyTools.convertToUnderscore(args.entityName)]: HandyTools.convertObjectKeysToUnderscore(args.entity)
      }
    }).then(
      (response) => dispatch({
        type: 'CREATE_ENTITY',
        entities: response.entities
      }),
      (response) => dispatch({
        type: 'ERRORS',
        errors: response
      })
    );
  }
}

export function fetchEntity(args) {
  return (dispatch) => {
    return $.ajax({
      method: 'GET',
      url: `/api/${args.directory}/${args.id}`
    }).then(
      (response) => dispatch({
        type: `FETCH_ENTITY`,
        entity: response.entity,
        array1: response.array1,
        array2: response.array2,
        array3: response.array3
      })
    );
  }
}

export function updateEntity(args) {
  return (dispatch) => {
    return $.ajax({
      method: 'PATCH',
      url: `/api/${args.directory}/${args.id}`,
      data: {
        [HandyTools.convertToUnderscore(args.entityName)]: HandyTools.convertObjectKeysToUnderscore(args.entity)
      }
    }).then(
      (response) => dispatch({
        type: 'UPDATE_ENTITY',
        entity: response.entity
      }),
      (response) => dispatch({
        type: 'ERRORS',
        errors: response
      })
    );
  }
}

export function deleteEntity(directory, id, callback) {
  return (dispatch) => {
    return $.ajax({
      method: 'DELETE',
      url: `/api/${directory}/${id}`
    }).then(
      (response) => {
        if (callback) {
          callback.call({}, response);
        } else {
          window.location.pathname = `/${directory}`;
        }
      }
    );
  }
}
