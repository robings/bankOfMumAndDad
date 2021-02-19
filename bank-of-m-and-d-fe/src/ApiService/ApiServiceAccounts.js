import { GetToken } from "../TokenService/TokenService";

export async function GetAllAccounts() {
  const token = GetToken();

  return await fetch('https://localhost:55741/api/Account/all', {
    headers: {
        'Authorization': token,
    }
  });
}

export async function GetAccountById(acId) {
  const token = GetToken();

  const accountUrl = `https://localhost:55741/api/Account/${acId.toString()}`;
  return await fetch(accountUrl, {
    headers: {
        'Authorization': token,
    }
  });
}

export async function PostNewAccount(data) {
  const token = GetToken();

  return await fetch('https://localhost:55741/api/Account', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
      },
      body: JSON.stringify(data)
  });
}

export async function DeleteAccount(data) {
  const token = GetToken();

  return await fetch('https://localhost:55741/api/Account', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(data),
  });
}
