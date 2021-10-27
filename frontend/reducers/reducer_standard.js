export default function(state = {}, action) {
  switch (action.type) {
  case 'SEND_REQUEST':
  case 'FETCH_ENTITIES':
  case 'NEW_ENTITY_DATA':
  case 'CREATE_ENTITY':
  case 'FETCH_ENTITY':
  case 'UPDATE_ENTITY':
    delete action["type"]
    return Object.assign({}, state, action);
  case 'ERRORS':
    return Object.assign({}, state, {
      errors: action.errors.responseJSON
    });
  case 'RUN_QUIZ':
    delete action["type"]
    return Object.assign({}, state, action);
  default:
    return state;
  }
}
