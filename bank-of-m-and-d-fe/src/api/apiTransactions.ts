import { ITransactionDto } from "../Interfaces/Entities/ITransactionDto";
import { getToken } from "../tokenHelper/tokenHelper";
import { APIBaseUrl } from "./apiSettings";

async function getTransactionsByAccountId(acId: string) {
  const token = getToken();

  const url = `${APIBaseUrl}/api/Transaction/${acId.toString()}`;

  return await fetch(url, {
    headers: {
      Authorization: token,
    },
  });
}

async function saveNewTransaction(data: ITransactionDto) {
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

const apiTransactions = {
  getTransactionsByAccountId,
  saveNewTransaction,
};

export default apiTransactions;
