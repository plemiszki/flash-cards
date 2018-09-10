export default function(state, action) {
  switch (action.type) {
  case 'FETCH_NOUN':
    console.log('in nouns reducer');
    console.log(action);
    return {
      fetching: false,
      noun: action.noun
    };
  }
  return {
    fetching: true,
    noun: {
      english: '',
      englishPlural: '',
      foreign: '',
      foreignPlural: '',
      gender: ''
    },
    nounSaved: {
      english: '',
      englishPlural: '',
      foreign: '',
      foreignPlural: '',
      gender: ''
    },
    errors: []
  };
}
