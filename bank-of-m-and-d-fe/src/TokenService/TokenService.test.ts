import { getToken, revokeToken, setToken, loggedIn } from "./tokenService";

beforeAll(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("token service", () => {
  const token = "myToken";

  test("gets token with bearer appended when getToken called", () => {
    localStorage.setItem("bearerToken", token);
    const expectedToken = `Bearer ${token}`;

    const actualToken = getToken();

    expect(actualToken).toEqual(expectedToken);
  });

  test("sets token when setToken called", () => {
    setToken(token);

    const dateNow: Date = new Date();
    const hours: string | number =
      dateNow.getHours() < 10 ? `0${dateNow.getHours()}` : dateNow.getHours();
    const minutes: string | number =
      dateNow.getMinutes() < 10
        ? `0${dateNow.getMinutes()}`
        : dateNow.getMinutes();

    const expectedTimePhrase = `Logged in at: ${hours}:${minutes}`;

    expect(localStorage.getItem("bearerToken")).toBe(token);
    expect(localStorage.getItem("loginTime")).toBe(expectedTimePhrase);
  });

  test("deletes localstorage values when revokeToken called", () => {
    localStorage.setItem("bearerToken", token);
    localStorage.setItem("loginTime", "login time string");

    revokeToken();

    expect(localStorage.getItem("bearerToken")).toBe(null);
    expect(localStorage.getItem("loginTime")).toBe(null);
  });

  test("loggedIn returns true when logged in", () => {
    localStorage.setItem("bearerToken", token);

    expect(loggedIn()).toBe(true);
  });

  test("loggedIn returns false when not logged in", () => {
    expect(loggedIn()).toBe(false);
  });
});
