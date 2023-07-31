const API_URL = 'http://127.0.0.1:3000/api/v1/users/'

export async function getLists(user_id) {
  try {
    const res = await fetch(API_URL + user_id + "/lists");
    const data = await res.json();
    return await data
  } catch (err) {
    console.error(err);
  }
}

export async function addList(title, user_id) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title })
  };
  return await fetch(API_URL + user_id + "/lists", requestOptions)
}

export async function deleteList(id, user_id) {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  return await fetch(API_URL + user_id + '/lists/' + id, requestOptions)
}

export async function switchLists(listId1, listId2, user_id) {
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  };
  return await fetch(API_URL + user_id + '/lists/' + listId1 + '/switch/' + listId2, requestOptions)
}