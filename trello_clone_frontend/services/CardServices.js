const API_URL = 'http://127.0.0.1:3000/api/v1/users'

// export async function getCards (listId) {
//   try {
//     const res = await fetch(API_URL + '/' + listId + "/cards");
//     const data = await res.json();
//     return await data
//   } catch (err) {
//     console.error(err);
//   }
// };

// export async function addCard(name, listId) {
//   const requestOptions = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title: name })
//   };
//   return await fetch(API_URL + '/' + listId + '/cards', requestOptions)
// }

// export async function deleteCard(cardId, listId) {
//   const requestOptions = {
//     method: 'DELETE',
//     headers: { 'Content-Type': 'application/json' },
//   };
//   return await fetch(API_URL + '/' + listId + '/cards/' + cardId, requestOptions)
// }

// export async function switchCards(cardId1, cardId2, listId) {
//   const requestOptions = {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//   };
//   return await fetch(API_URL + '/' + listId + '/cards/' + cardId1 + '/switch/' + cardId2, requestOptions)
// }

// rewrite all of the above functions have user_id in their parameters and
// add the user_id after the API_URL in the fetch requests
//
export async function getCards (listId, user_id) {
  try {
    const res = await fetch(API_URL + '/' + user_id + '/lists/' + listId + "/cards");
    const data = await res.json();
    return await data
  } catch (err) {
    console.error(err);
  }
}

export async function addCard(name, listId, user_id) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: name })
  };
  return await fetch(API_URL + '/' + user_id + '/lists/' + listId + '/cards', requestOptions)
}

export async function deleteCard(cardId, listId, user_id) {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  return await fetch(API_URL + '/' + user_id + '/lists/' + listId + '/cards/' + cardId, requestOptions)
}

export async function switchCards(cardId1, cardId2, listId, user_id) {
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  };
  return await fetch(API_URL + '/' + user_id + '/lists/' + listId + '/cards/' + cardId1 + '/switch/' + cardId2, requestOptions)
}