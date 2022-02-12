import fetch from "jest-fetch-mock";
import { ILoginDto } from "../Interfaces/Entities/ILoginDto";
import apiUser from "./apiUser";
import { APIBaseUrl } from "./apiSettings";
import apiStrings from "../constants/api.strings";

beforeEach(() => {
  fetch.enableMocks();
  fetch.resetMocks();
});

describe("login api call", () => {
  const username: string = "username";
  const password: string = "password";
  const data: ILoginDto = {
    username,
    password,
  };

  test("calls fetch with correct method, header and body", async () => {
    const response = { token: "myToken" };

    fetch.mockResponseOnce(JSON.stringify(response));

    await apiUser.login(data);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe(`${APIBaseUrl}/api/login`);
    expect(fetch.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
    });
    expect(fetch.mock.calls[0][1]?.method).toBe("POST");
  });

  test("returns expected data on successful call", async () => {
    const responseData = { token: "myToken" };

    fetch.mockResponseOnce(JSON.stringify(responseData));

    const response = await apiUser.login(data);

    expect(response).toEqual(responseData);
  });

  test("throws if API unavailable", async () => {
    fetch.mockReject(new Error("API not available."));

    await expect(() => apiUser.login(data)).rejects.toThrow(
      apiStrings.user.error
    );
  });

  const fourHundredCodes: number[] = [400, 401, 403, 404];
  test.each(fourHundredCodes)(
    "throws if a response is received with status code: %p",
    async (code) => {
      fetch.mockResponseOnce("Error", { status: code });

      await expect(() => apiUser.login(data)).rejects.toThrow(
        apiStrings.user.incorrectCredentials
      );
    }
  );

  test("throws if a response is received with a 500 status code", async () => {
    fetch.mockResponseOnce("Error", { status: 500 });

    await expect(() => apiUser.login(data)).rejects.toThrow(
      apiStrings.user.error
    );
  });
});