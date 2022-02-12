import { IAccountDto } from "../Interfaces/Entities/IAccountDto";
import { IIdOnlyRequest } from "../Interfaces/Entities/IIdOnlyRequest";
import { getToken } from "../tokenHelper/tokenHelper";
import { APIBaseUrl } from "./apiSettings";

export async function getAllAccounts(): Promise<Response> {
  const token: string = getToken();

  return await fetch(`${APIBaseUrl}/api/Account/all`, {
    headers: {
      Authorization: token,
    },
  });
}

export async function getAccountById(acId: string) {
  const token: string = getToken();

  const accountUrl = `${APIBaseUrl}/api/Account/${acId.toString()}`;
  return await fetch(accountUrl, {
    headers: {
      Authorization: token,
    },
  });
}

export async function postNewAccount(data: IAccountDto) {
  const token = getToken();

  return await fetch(`${APIBaseUrl}/api/Account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteAccount(data: IIdOnlyRequest): Promise<Response> {
  const token = getToken();

  return await fetch(`${APIBaseUrl}/api/Account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
}
