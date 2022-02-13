import fetch from "jest-fetch-mock";
import apiStrings from "../constants/api.strings";
import appStrings from "../constants/app.strings";
import { IAccount } from "../Interfaces/Entities/IAccount";
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
  test("calls fetch with correct method, header and body", async () => {
    const response: IResponse<IAccount[]> = {
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

    const token = "myToken";

    localStorage.setItem(appStrings.localStorageKeys.bearerToken, token);

    fetch.mockResponseOnce(JSON.stringify(response));

    await apiAccounts.getAllAccounts();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe(`${APIBaseUrl}/api/Account/all`);
    expect(fetch.mock.calls[0][1]?.headers).toEqual({
      Authorization: `${appStrings.tokenPrefix}${token}`,
    });
    expect(fetch.mock.calls[0][1]?.method).toBe("GET");
  });

  test("returns expected data on successful call", async () => {
    const responseData: IResponse<IAccount[]> = {
      success: true,
      message: "",
      data: [
        {
          id: 1,
          firstName: "Bob",
          lastName: "Cuthbert",
          openingBalance: 300,
          currentBalance: 300,
          transactions: null,
        },
        {
          id: 2,
          firstName: "Van",
          lastName: "Dennis",
          openingBalance: 300,
          currentBalance: 1000,
          transactions: null,
        },
      ],
    };

    fetch.mockResponseOnce(JSON.stringify(responseData));

    const response = await apiAccounts.getAllAccounts();

    expect(response).toEqual(responseData);
  });

  test("throws if API unavailable", async () => {
    fetch.mockReject(new Error("API not available."));

    await expect(() => apiAccounts.getAllAccounts()).rejects.toThrow(
      apiStrings.accounts.allAccountsError
    );
  });

  const fourHundredCodes: number[] = [400, 401, 403, 404];
  test.each(fourHundredCodes)(
    "throws if a response is received with status code: %p",
    async (code) => {
      fetch.mockResponseOnce("Error", { status: code });

      await expect(() => apiAccounts.getAllAccounts()).rejects.toThrow(
        apiStrings.accounts.noAccounts
      );
    }
  );

  test("throws if a response is received with a 500 status code", async () => {
    fetch.mockResponseOnce("Error", { status: 500 });

    await expect(() => apiAccounts.getAllAccounts()).rejects.toThrow(
      apiStrings.accounts.allAccountsError
    );
  });
});
