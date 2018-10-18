export default function(state = {}, action) {
  switch (action.type) {
  case 'FETCH_ENTITIES':
    return Object.assign({}, state, {
      entities: action.entities
    });
  case 'CREATE_ENTITY':
    return Object.assign({}, state, {
      entities: action.entities,
      errors: action.errors
    });
  case 'FETCH_ENTITY':
    return Object.assign({}, state, {
      entity: action.entity,
      array1: action.array1,
      array2: action.array2,
      array3: action.array3
    });
  case 'UPDATE_ENTITY':
    return Object.assign({}, state, {
      entity: action.entity
    });
  case 'ERRORS':
    return Object.assign({}, state, {
      errors: action.errors.responseJSON
    });
  default:
    return state;
  }
}
