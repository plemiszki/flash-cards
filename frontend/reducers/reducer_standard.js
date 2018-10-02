export default function(state = {}, action) {
  switch (action.type) {
  case 'STANDARD_FETCH_INDEX':
    return Object.assign({}, state, {
      entities: action.entities
    });
  default:
    return state;
  }
}
