import { toast } from "react-toastify";
import apiStrings from "../constants/api.strings";
import appStrings from "../constants/app.strings";
import { IAccount } from "../Interfaces/Entities/IAccount";
import { IAccountDto } from "../Interfaces/Entities/IAccountDto";
import { IIdOnlyRequest } from "../Interfaces/Entities/IIdOnlyRequest";
import { IResponse } from "../Interfaces/Entities/IResponse";
import { getToken } from "../tokenHelper/tokenHelper";
import { APIBaseUrl } from "../constants/api.settings";

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
        autoClose: false,
      },
    }
  );

  return accountsResponse;
}

async function saveNewAccount(data: IAccountDto): Promise<void> {
  await toast.promise(
    async () => {
      const token = getToken();

      let response: Response;

      try {
        response = await fetch(`${APIBaseUrl}/api/Account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(data),
        });
      } catch {
        throw new Error(apiStrings.accounts.saveError);
      }

      if (response.status === 401) {
        authErrorCallback();
        throw new Error(appStrings.loggedOut);
      }

      if (response.status >= 400 && response.status < 501) {
        throw new Error(apiStrings.accounts.saveError);
      }
    },
    {
      pending: undefined,
      success: apiStrings.accounts.saved,
      error: {
        render({ data }: any) {
          return `${data.message}`;
        },
      },
    }
  );
}

async function deleteAccount(id: number): Promise<void> {
  await toast.promise(
    async () => {
      const token = getToken();

      const data: IIdOnlyRequest = { id: id.toString() };

      let response: Response;

      try {
        response = await fetch(`${APIBaseUrl}/api/Account`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(data),
        });
      } catch {
        throw new Error(apiStrings.accounts.deleteError);
      }

      if (response.status === 401) {
        authErrorCallback();
        throw new Error(appStrings.loggedOut);
      }

      if (response.status >= 400 && response.status < 500) {
        throw new Error(apiStrings.accounts.deleteAccountError);
      }

      if (response.status === 500) {
        throw new Error(apiStrings.accounts.deleteError);
      }
    },
    {
      pending: undefined,
      success: apiStrings.accounts.deleted,
      error: {
        render({ data }: any) {
          return `${data.message}`;
        },
      },
    }
  );
}

const apiAccounts = {
  getAllAccounts,
  saveNewAccount,
  deleteAccount,
  registerAuthErrorCallback,
  unregisterAuthErrorCallback,
};

export default apiAccounts;
