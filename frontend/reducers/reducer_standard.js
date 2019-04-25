export default function(state = {}, action) {
  switch (action.type) {
  case 'FETCH_ENTITIES':
    delete action["type"]
    return Object.assign({}, state, action);
  case 'CREATE_ENTITY':
    delete action["type"]
    return Object.assign({}, state, action);
  case 'FETCH_ENTITY':
    delete action["type"]
    return Object.assign({}, state, action);
  case 'UPDATE_ENTITY':
    delete action["type"]
    return Object.assign({}, state, action);
  case 'ERRORS':
    return Object.assign({}, state, {
      errors: action.errors.responseJSON
    });
  default:
    return state;
  }
}
