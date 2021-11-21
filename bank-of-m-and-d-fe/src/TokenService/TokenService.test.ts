import { getToken } from "./TokenService";

beforeAll(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("token service", () => {
  test("gets token with bearer appended when getToken called", () => {
    const token = "myToken";
    localStorage.setItem("bearerToken", token);
    const expectedToken = `Bearer ${token}`;

    const actualToken = getToken();

    expect(actualToken).toEqual(expectedToken);
  });
});
