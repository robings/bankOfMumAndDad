import { IAccountDto } from "../Interfaces/Entities/IAccountDto";
import { IIdOnlyRequest } from "../Interfaces/Entities/IIdOnlyRequest";
import { GetToken } from "../TokenService/TokenService";
import { APIBaseUrl } from './apiSettings';

export async function GetAllAccounts(): Promise<Response> {
  const token: string = GetToken();

  return await fetch(`${APIBaseUrl}/api/Account/all`, {
    headers: {
        'Authorization': token,
    }
  });
}

export async function GetAccountById(acId: string) {
  const token: string = GetToken();

  const accountUrl = `${APIBaseUrl}/api/Account/${acId.toString()}`;
  return await fetch(accountUrl, {
    headers: {
        'Authorization': token,
    }
  });
}

export async function PostNewAccount(data: IAccountDto) {
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

export async function DeleteAccount(data: IIdOnlyRequest) {
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
