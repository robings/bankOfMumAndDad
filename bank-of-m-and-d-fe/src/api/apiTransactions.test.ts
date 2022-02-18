import fetch from "jest-fetch-mock";
import apiStrings from "../constants/api.strings";
import appStrings from "../constants/app.strings";
import { IResponse } from "../Interfaces/Entities/IResponse";
import apiTransactions from "./apiTransactions";
import { APIBaseUrl } from "./apiSettings";
import {
  IListOfTransactionsForAccount,
  ITransaction,
  TransactionType,
} from "../Interfaces/Entities/ITransaction";
import { ITransactionDto } from "../Interfaces/Entities/ITransactionDto";

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

describe("transactions api", () => {
  const id = "10044";

  describe("authErrorCallback registration", () => {
    test("registers callback, and calls it on unauthorised call", async () => {
      const callbackToRegister = jest.fn();

      apiTransactions.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiTransactions.getTransactionsByAccountId(id);
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });

    test("does not call callback after it is unregistered", async () => {
      const callbackToRegister = jest.fn();

      apiTransactions.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiTransactions.getTransactionsByAccountId(id);
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);

      apiTransactions.unregisterAuthErrorCallback();

      try {
        await apiTransactions.getTransactionsByAccountId(id);
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTransactionsByAccountId", () => {
    const transactionsResponse: IResponse<IListOfTransactionsForAccount> = {
      success: true,
      message: "",
      data: {
        accountId: parseInt(id),
        firstName: "Colin",
        lastName: "Caterpillar",
        openingBalance: 0,
        currentBalance: 100,
        transactions: [
          {
            amount: 150,
            balance: 150,
            date: "2022-02-16T00:00:00",
            type: TransactionType.deposit,
            comments: "Deposit 1",
          },
          {
            amount: 50,
            balance: 200,
            date: "2022-02-17T00:00:00",
            type: TransactionType.deposit,
            comments: "Deposit 2",
          },
          {
            amount: 100,
            balance: 100,
            date: "2022-02-18T00:00:00",
            type: TransactionType.withdrawal,
            comments: "Withdrawal",
          },
        ],
      },
    };

    test("calls fetch with correct method, header and body", async () => {
      const token = "myToken";

      localStorage.setItem(appStrings.localStorageKeys.bearerToken, token);

      fetch.mockResponseOnce(JSON.stringify(transactionsResponse));

      await apiTransactions.getTransactionsByAccountId(id);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(
        `${APIBaseUrl}/api/Transaction/${id}`
      );
      expect(fetch.mock.calls[0][1]?.headers).toEqual({
        Authorization: `${appStrings.tokenPrefix}${token}`,
      });
      expect(fetch.mock.calls[0][1]?.method).toBe("GET");
      expect(fetch.mock.calls[0][1]?.body).toBe(undefined);
    });

    test("returns expected data on successful call", async () => {
      fetch.mockResponseOnce(JSON.stringify(transactionsResponse));

      const expectedTransactions: ITransaction[] = [
        {
          amount: 150,
          balance: 150,
          date: "2022-02-16",
          type: TransactionType.deposit,
          comments: "Deposit 1",
        },
        {
          amount: 50,
          balance: 200,
          date: "2022-02-17",
          type: TransactionType.deposit,
          comments: "Deposit 2",
        },
        {
          amount: 100,
          balance: 100,
          date: "2022-02-18",
          type: TransactionType.withdrawal,
          comments: "Withdrawal",
        },
      ];

      const expectedConvertedTransactions: IListOfTransactionsForAccount = {
        ...transactionsResponse.data,
        transactions: expectedTransactions,
      };

      const response = await apiTransactions.getTransactionsByAccountId(id);

      expect(response).toEqual(expectedConvertedTransactions);
    });

    test("throws if API unavailable", async () => {
      fetch.mockReject(new Error("API not available."));

      await expect(() =>
        apiTransactions.getTransactionsByAccountId(id)
      ).rejects.toThrow(apiStrings.transactions.error);
    });

    const fourHundredCodes: number[] = [400, 403];
    test.each(fourHundredCodes)(
      "throws if a response is received with status code: %p",
      async (code) => {
        fetch.mockResponseOnce("Error", { status: code });

        await expect(() =>
          apiTransactions.getTransactionsByAccountId(id)
        ).rejects.toThrow(apiStrings.transactions.noTransactions);
      }
    );

    const scenarios404: Array<[object, string]> = [
      [
        { data: [], message: "Account not found.", success: false },
        apiStrings.transactions.noAccount,
      ],
      [
        {
          data: [],
          message: "No transactions found for account.",
          success: false,
        },
        apiStrings.transactions.noTransactions,
      ],
    ];
    test.each(scenarios404)(
      "throws with message indicating the account was not found if account not found",
      async (scenario, expectedMessage) => {
        fetch.mockResponseOnce(JSON.stringify(scenario), { status: 404 });

        await expect(() =>
          apiTransactions.getTransactionsByAccountId(id)
        ).rejects.toThrow(expectedMessage);
      }
    );

    test("calls authErrorCallback if response is received with a 401 status code", async () => {
      const callbackToRegister = jest.fn();

      apiTransactions.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiTransactions.getTransactionsByAccountId(id);
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });

    test("throws if a response is received with a 500 status code", async () => {
      fetch.mockResponseOnce("Error", { status: 500 });

      await expect(() =>
        apiTransactions.getTransactionsByAccountId(id)
      ).rejects.toThrow(apiStrings.transactions.error);
    });
  });

  describe("saveNewTransaction", () => {
    const data: ITransactionDto = {
      amount: 100,
      type: "0",
      date: new Date("2022-02-18"),
      comments: "test transaction",
      accountId: "10055",
    };

    test("calls fetch with correct method, header and body", async () => {
      const token = "myToken";

      const responseData: IResponse<object> = {
        success: true,
        message: "Successfully added transaction.",
        data: [],
      };

      localStorage.setItem(appStrings.localStorageKeys.bearerToken, token);

      fetch.mockResponseOnce(JSON.stringify(responseData));

      await apiTransactions.saveNewTransaction(data);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(`${APIBaseUrl}/api/Transaction`);
      expect(fetch.mock.calls[0][1]?.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: `${appStrings.tokenPrefix}${token}`,
      });
      expect(fetch.mock.calls[0][1]?.method).toBe("POST");
      expect(fetch.mock.calls[0][1]?.body).toBe(JSON.stringify(data));
    });

    test("throws if API unavailable", async () => {
      fetch.mockReject(new Error("API not available."));

      await expect(() =>
        apiTransactions.saveNewTransaction(data)
      ).rejects.toThrow(apiStrings.transactions.saveError);
    });

    const fourHundredCodes: number[] = [400, 403, 404];
    test.each(fourHundredCodes)(
      "throws if a response is received with status code: %p",
      async (code) => {
        fetch.mockResponseOnce("Error", { status: code });

        await expect(() =>
          apiTransactions.saveNewTransaction(data)
        ).rejects.toThrow(apiStrings.transactions.saveError);
      }
    );

    test("calls authErrorCallback if response is received with a 401 status code", async () => {
      const callbackToRegister = jest.fn();

      apiTransactions.registerAuthErrorCallback(callbackToRegister);

      fetch.mockResponseOnce("Error", { status: 401 });

      try {
        await apiTransactions.saveNewTransaction(data);
      } catch {}

      expect(callbackToRegister).toHaveBeenCalledTimes(1);
    });

    test("throws if a response is received with a 500 status code", async () => {
      fetch.mockResponseOnce("Error", { status: 500 });

      await expect(() =>
        apiTransactions.saveNewTransaction(data)
      ).rejects.toThrow(apiStrings.transactions.saveError);
    });
  });
});
