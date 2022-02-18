import { toast } from "react-toastify";
import {
  IListOfTransactionsForAccount,
  ITransaction,
} from "../Interfaces/Entities/ITransaction";
import { ITransactionDto } from "../Interfaces/Entities/ITransactionDto";
import { getToken } from "../tokenHelper/tokenHelper";
import { APIBaseUrl } from "./apiSettings";

const emptyAuthErrorCallback = async () => {
  Promise.resolve();
};
let authErrorCallback: () => void = emptyAuthErrorCallback;

const registerAuthErrorCallback = (callback: () => void) => {
  authErrorCallback = callback;
};

const unregisterAuthErrorCallback = () => {
  authErrorCallback = emptyAuthErrorCallback;
};

function processData(
  dataToConvert: IListOfTransactionsForAccount
): IListOfTransactionsForAccount {
  const convertedTransactions: ITransaction[] = dataToConvert.transactions;

  convertedTransactions.forEach((transaction) => {
    transaction.date = transaction.date.split("T")[0].trim();
  });

  const convertedData: IListOfTransactionsForAccount = {
    accountId: dataToConvert.accountId,
    firstName: dataToConvert.firstName,
    lastName: dataToConvert.lastName,
    openingBalance: dataToConvert.openingBalance,
    currentBalance: dataToConvert.currentBalance,
    transactions: convertedTransactions,
  };
  return convertedData;
}

async function getTransactionsByAccountId(
  acId: string
): Promise<IListOfTransactionsForAccount> {
  const transactionsResponse = await toast.promise(
    async () => {
      const token = getToken();

      const url = `${APIBaseUrl}/api/Transaction/${acId.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 401) {
        authErrorCallback();
      }

      return response.json();
    },
    {
      pending: undefined,
      success: undefined,
      error: {
        render({ data }: any) {
          return `${data.message}`;
        },
        autoClose: false,
      },
    }
  );

  const convertedTransactions: IListOfTransactionsForAccount = processData(
    transactionsResponse.data
  );

  return convertedTransactions;
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
  registerAuthErrorCallback,
  unregisterAuthErrorCallback,
};

export default apiTransactions;
