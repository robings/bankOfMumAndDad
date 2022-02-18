import { toast } from "react-toastify";
import apiStrings from "../constants/api.strings";
import appStrings from "../constants/app.strings";
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

      let response: Response;

      try {
        response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
      } catch {
        throw new Error(apiStrings.transactions.error);
      }

      if (response.status === 401) {
        authErrorCallback();
        throw new Error(appStrings.loggedOut);
      }

      if (response.status === 404) {
        const responseJson: {
          data: any;
          success: boolean;
          message: string;
        } = await response.json();
        if (responseJson.message === "Account not found.") {
          throw new Error(apiStrings.transactions.noAccount);
        }
      }

      if (response.status >= 400 && response.status < 500) {
        throw new Error(apiStrings.transactions.noTransactions);
      }

      if (response.status === 500) {
        throw new Error(apiStrings.transactions.error);
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

async function saveNewTransaction(data: ITransactionDto): Promise<void> {
  await toast.promise(
    async () => {
      const token = getToken();

      let response: Response;

      try {
        response = await fetch(`${APIBaseUrl}/api/Transaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(data),
        });
      } catch {
        throw new Error(apiStrings.transactions.saveError);
      }

      if (response.status === 401) {
        authErrorCallback();
        throw new Error(appStrings.loggedOut);
      }

      if (response.status >= 400 && response.status < 501) {
        throw new Error(apiStrings.transactions.saveError);
      }
    },
    {
      pending: undefined,
      success: apiStrings.transactions.saved,
      error: {
        render({ data }: any) {
          return `${data.message}`;
        },
      },
    }
  );
}

const apiTransactions = {
  getTransactionsByAccountId,
  saveNewTransaction,
  registerAuthErrorCallback,
  unregisterAuthErrorCallback,
};

export default apiTransactions;
