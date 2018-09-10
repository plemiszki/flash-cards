export function fetchNoun(id) {

  return (dispatch) => {

    return $.ajax({
      method: "GET",
      url: `/api/nouns/${id}`
    }).then(
      (response) => dispatch({
        type: 'FETCH_NOUN',
        noun: response.noun
      }),
      (response) => dispatch(receiveErrors(response))
    );
  }
}
