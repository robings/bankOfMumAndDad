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
  });
});
