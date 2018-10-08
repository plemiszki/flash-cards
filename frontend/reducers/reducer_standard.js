export default function(state = {}, action) {
  switch (action.type) {
  case 'STANDARD_FETCH_INDEX':
    return Object.assign({}, state, {
      entities: action.entities
    });
  case 'STANDARD_CREATE':
    return Object.assign({}, state, {
      entities: action.entities,
      errors: action.errors
    });
  case 'ERRORS':
    return Object.assign({}, state, {
      errors: action.errors.responseJSON
    });
  default:
    return state;
  }
}
