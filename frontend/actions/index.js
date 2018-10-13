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
        [args.entityName]: HandyTools.convertObjectKeysToUnderscore(args.entity)
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
        entity: response.entity
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
        [args.entityName]: HandyTools.convertObjectKeysToUnderscore(args.entity)
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

export function deleteEntity(directory, id) {
  return (dispatch) => {
    return $.ajax({
      method: 'DELETE',
      url: `/api/${directory}/${id}`
    }).then(
      () => {
        window.location.pathname = `/${directory}`;
      }
    );
  }
}
