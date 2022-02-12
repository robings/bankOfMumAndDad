import { ITransactionDto } from "../Interfaces/Entities/ITransactionDto";
import { getToken } from "../tokenHelper/tokenHelper";
import { APIBaseUrl } from "./apiSettings";

export async function getTransactionsByAccountId(acId: string) {
  const token = getToken();

  const url = `${APIBaseUrl}/api/Transaction/${acId.toString()}`;

  return await fetch(url, {
    headers: {
      Authorization: token,
    },
  });
}

export async function saveNewTransaction(data: ITransactionDto) {
  const token = getToken();

  return await fetch(`${APIBaseUrl}/api/Transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
}
