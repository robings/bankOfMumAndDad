import fetch from "jest-fetch-mock";
import apiStrings from "../constants/api.strings";
import appStrings from "../constants/app.strings";
import { IAccount } from "../Interfaces/Entities/IAccount";
import { IAccountDto } from "../Interfaces/Entities/IAccountDto";
import { IResponse } from "../Interfaces/Entities/IResponse";
import apiAccounts from "./apiAccounts";
import { APIBaseUrl } from "./apiSettings";

beforeEach(() => {
  fetch.enableMocks();
  fetch.resetMocks();
});

beforeAll(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("accounts api", () => {
  describe("authErrorCallback registration", () => {
    test("registers callback, and calls it on unauthorised call", async () => {
      const callbackToRegister = jest.fn();

      apiAccounts.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiAccounts.getAllAccounts();
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });

    test("does not call callback after it is unregistered", async () => {
      const callbackToRegister = jest.fn();

      apiAccounts.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiAccounts.getAllAccounts();
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);

      apiAccounts.unregisterAuthErrorCallback();

      try {
        await apiAccounts.getAllAccounts();
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAllAccounts", () => {
    const accountsResponse: IResponse<IAccount[]> = {
      success: true,
      message: "",
      data: [
        {
          id: 1,
          firstName: "Bob",
          lastName: "Cuthbert",
          openingBalance: 300,
          currentBalance: 300,
          transactions: [],
        },
        {
          id: 1,
          firstName: "Van",
          lastName: "Dennis",
          openingBalance: 300,
          currentBalance: 1000,
          transactions: [],
        },
      ],
    };

    test("calls fetch with correct method, header and body", async () => {
      const token = "myToken";

      localStorage.setItem(appStrings.localStorageKeys.bearerToken, token);

      fetch.mockResponseOnce(JSON.stringify(accountsResponse));

      await apiAccounts.getAllAccounts();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(`${APIBaseUrl}/api/Account/all`);
      expect(fetch.mock.calls[0][1]?.headers).toEqual({
        Authorization: `${appStrings.tokenPrefix}${token}`,
      });
      expect(fetch.mock.calls[0][1]?.method).toBe("GET");
      expect(fetch.mock.calls[0][1]?.body).toBe(undefined);
    });

    test("returns expected data on successful call", async () => {
      fetch.mockResponseOnce(JSON.stringify(accountsResponse));

      const response = await apiAccounts.getAllAccounts();

      expect(response).toEqual(accountsResponse);
    });

    test("throws if API unavailable", async () => {
      fetch.mockReject(new Error("API not available."));

      await expect(() => apiAccounts.getAllAccounts()).rejects.toThrow(
        apiStrings.accounts.allAccountsError
      );
    });

    const fourHundredCodes: number[] = [400, 403, 404];
    test.each(fourHundredCodes)(
      "throws if a response is received with status code: %p",
      async (code) => {
        fetch.mockResponseOnce("Error", { status: code });

        await expect(() => apiAccounts.getAllAccounts()).rejects.toThrow(
          apiStrings.accounts.noAccounts
        );
      }
    );

    test("calls authErrorCallback if response is received with a 401 status code", async () => {
      const callbackToRegister = jest.fn();

      apiAccounts.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiAccounts.getAllAccounts();
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });

    test("throws if a response is received with a 500 status code", async () => {
      fetch.mockResponseOnce("Error", { status: 500 });

      await expect(() => apiAccounts.getAllAccounts()).rejects.toThrow(
        apiStrings.accounts.allAccountsError
      );
    });
  });

  describe("deleteAccount", () => {
    test("calls fetch with correct method, header and body", async () => {
      const token = "myToken";

      const responseData = {
        success: true,
        message: "Account successfully deleted",
        data: [],
      };

      localStorage.setItem(appStrings.localStorageKeys.bearerToken, token);

      fetch.mockResponseOnce(JSON.stringify(responseData));

      const id = 10003;

      await apiAccounts.deleteAccount(id);

      const expectedBody = JSON.stringify({ id: id.toString() });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(`${APIBaseUrl}/api/Account`);
      expect(fetch.mock.calls[0][1]?.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: `${appStrings.tokenPrefix}${token}`,
      });
      expect(fetch.mock.calls[0][1]?.method).toBe("DELETE");
      expect(fetch.mock.calls[0][1]?.body).toBe(expectedBody);
    });

    test("throws if API unavailable", async () => {
      fetch.mockReject(new Error("API not available."));

      await expect(() => apiAccounts.deleteAccount(10004)).rejects.toThrow(
        apiStrings.accounts.deleteError
      );
    });

    const fourHundredCodes: number[] = [400, 403, 404];
    test.each(fourHundredCodes)(
      "throws if a response is received with status code: %p",
      async (code) => {
        fetch.mockResponseOnce("Error", { status: code });

        await expect(() => apiAccounts.deleteAccount(10004)).rejects.toThrow(
          apiStrings.accounts.deleteAccountError
        );
      }
    );

    test("calls authErrorCallback if response is received with a 401 status code", async () => {
      const callbackToRegister = jest.fn();

      apiAccounts.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiAccounts.deleteAccount(10004);
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });

    test("throws if a response is received with a 500 status code", async () => {
      fetch.mockResponseOnce("Error", { status: 500 });

      await expect(() => apiAccounts.deleteAccount(10004)).rejects.toThrow(
        apiStrings.accounts.deleteError
      );
    });
  });

  describe("saveNewAccount", () => {
    const data: IAccountDto = {
      currentBalance: "100",
      firstName: "Newbie",
      lastName: "Account",
      openingBalance: "100",
    };

    test("calls fetch with correct method, header and body", async () => {
      const token = "myToken";

      const responseData: IResponse<IAccount & { deleted: boolean }> = {
        success: true,
        message: "Successfully created account.",
        data: {
          id: 12345,
          currentBalance: 100,
          openingBalance: 100,
          firstName: "Newbie",
          lastName: "Account",
          transactions: null,
          deleted: false,
        },
      };

      localStorage.setItem(appStrings.localStorageKeys.bearerToken, token);

      fetch.mockResponseOnce(JSON.stringify(responseData));

      await apiAccounts.saveNewAccount(data);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(`${APIBaseUrl}/api/Account`);
      expect(fetch.mock.calls[0][1]?.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: `${appStrings.tokenPrefix}${token}`,
      });
      expect(fetch.mock.calls[0][1]?.method).toBe("POST");
      expect(fetch.mock.calls[0][1]?.body).toBe(JSON.stringify(data));
    });

    test("throws if API unavailable", async () => {
      fetch.mockReject(new Error("API not available."));

      await expect(() => apiAccounts.saveNewAccount(data)).rejects.toThrow(
        apiStrings.accounts.saveError
      );
    });

    const fourHundredCodes: number[] = [400, 403, 404];
    test.each(fourHundredCodes)(
      "throws if a response is received with status code: %p",
      async (code) => {
        fetch.mockResponseOnce("Error", { status: code });

        await expect(() => apiAccounts.saveNewAccount(data)).rejects.toThrow(
          apiStrings.accounts.saveError
        );
      }
    );

    test("calls authErrorCallback if response is received with a 401 status code", async () => {
      const callbackToRegister = jest.fn();

      apiAccounts.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiAccounts.saveNewAccount(data);
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });

    test("throws if a response is received with a 500 status code", async () => {
      fetch.mockResponseOnce("Error", { status: 500 });

      await expect(() => apiAccounts.saveNewAccount(data)).rejects.toThrow(
        apiStrings.accounts.saveError
      );
    });
  });
});
