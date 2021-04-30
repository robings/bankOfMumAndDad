import { GetToken } from "../TokenService/TokenService";
import { APIBaseUrl } from './apiSettings';

export async function GetAllAccounts() {
  const token = GetToken();

  return await fetch(`${APIBaseUrl}/api/Account/all`, {
    headers: {
        'Authorization': token,
    }
  });
}

export async function GetAccountById(acId) {
  const token = GetToken();

  const accountUrl = `${APIBaseUrl}/api/Account/${acId.toString()}`;
  return await fetch(accountUrl, {
    headers: {
        'Authorization': token,
    }
  });
}

export async function PostNewAccount(data) {
  const token = GetToken();

  return await fetch(`${APIBaseUrl}/api/Account`, {
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

  return await fetch(`${APIBaseUrl}/api/Account`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(data),
  });
}
