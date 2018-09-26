export default function(state = {}, action) {
  switch (action.type) {
  case 'FETCH_NOUN':
    return Object.assign({}, state, {
      noun: action.noun
    });
  case 'UPDATE_NOUN':
    return Object.assign({}, state, {
      noun: action.noun
    });
  case 'ERRORS':
    console.log('state in errors case');
    console.log(state);
    return Object.assign({}, state, {
      errors: action.errors.responseJSON
    });
  default:
    return state;
  }
}
