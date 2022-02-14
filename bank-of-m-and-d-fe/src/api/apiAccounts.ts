import { toast } from "react-toastify";
import apiStrings from "../constants/api.strings";
import appStrings from "../constants/app.strings";
import { IAccount } from "../Interfaces/Entities/IAccount";
import { IAccountDto } from "../Interfaces/Entities/IAccountDto";
import { IIdOnlyRequest } from "../Interfaces/Entities/IIdOnlyRequest";
import { IResponse } from "../Interfaces/Entities/IResponse";
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

async function getAllAccounts(): Promise<IResponse<IAccount[]>> {
  const accountsResponse = await toast.promise(
    async () => {
      const token: string = getToken();

      let response: Response;

      try {
        response = await fetch(`${APIBaseUrl}/api/Account/all`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
      } catch {
        throw new Error(apiStrings.accounts.allAccountsError);
      }

      if (response.status === 401) {
        authErrorCallback();
        throw new Error(appStrings.loggedOut);
      }

      if (response.status >= 400 && response.status < 500) {
        throw new Error(apiStrings.accounts.noAccounts);
      }

      if (response.status === 500) {
        throw new Error(apiStrings.accounts.allAccountsError);
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
      },
    }
  );

  return accountsResponse;
}

async function getAccountById(acId: string) {
  const token: string = getToken();

  const accountUrl = `${APIBaseUrl}/api/Account/${acId.toString()}`;
  return await fetch(accountUrl, {
    headers: {
      Authorization: token,
    },
  });
}

async function saveNewAccount(data: IAccountDto) {
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

async function deleteAccount(data: IIdOnlyRequest): Promise<Response> {
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

const apiAccounts = {
  getAllAccounts,
  getAccountById,
  saveNewAccount,
  deleteAccount,
  registerAuthErrorCallback,
  unregisterAuthErrorCallback,
};

export default apiAccounts;
