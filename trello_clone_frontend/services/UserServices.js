const API_URL = 'http://127.0.0.1:3000/api/v1'

export async function signUp(firstname, lastname, email) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstname, last_name: lastname, email: email })
    };
    return await fetch(API_URL + '/signup', requestOptions)
}

export async function signIn(email) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    };
    return await fetch(API_URL + '/signin', requestOptions)
}