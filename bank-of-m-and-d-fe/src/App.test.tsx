import { act, render, screen, within, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { toast } from "react-toastify";
import App from "./App";
import appStrings from "./constants/app.strings";
import apiUser from "./api/apiUser";
import apiAccounts from "./api/apiAccounts";
import apiTransactions from "./api/apiTransactions";
import userEvent from "@testing-library/user-event";
import fetch from "jest-fetch-mock";
import { IResponse } from "./Interfaces/Entities/IResponse";
import { IAccount } from "./Interfaces/Entities/IAccount";
import { TransactionType } from "./Interfaces/Entities/ITransaction";

jest.mock("./api/apiUser");
jest.mock("./api/apiAccounts");
jest.mock("./api/apiTransactions");

beforeEach(() => {
  fetch.enableMocks();
  fetch.resetMocks();
});

beforeAll(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("app", () => {
  const token = "myToken";

  const accountsResponse: IResponse<IAccount[]> = {
    success: true,
    message: "",
    data: [
      {
        id: 10001,
        firstName: "Bob",
        lastName: "Cuthbert",
        openingBalance: 300,
        currentBalance: 300,
        transactions: [],
      },
      {
        id: 10002,
        firstName: "Van",
        lastName: "Dennis",
        openingBalance: 300,
        currentBalance: 1000,
        transactions: [],
      },
    ],
  };

  const renderApp = () => {
    const initialEntries = ["/"];

    render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  };

  const loginToApp = async () => {
    localStorage.setItem(appStrings.localStorageKeys.bearerToken, token);

    const loginMock = apiUser.login as jest.MockedFunction<
      typeof apiUser.login
    >;
    loginMock.mockResolvedValue();

    const getAllAccountsMock =
      apiAccounts.getAllAccounts as jest.MockedFunction<
        typeof apiAccounts.getAllAccounts
      >;
    getAllAccountsMock.mockResolvedValue(accountsResponse);

    renderApp();

    userEvent.type(
      await screen.findByLabelText(appStrings.loginForm.usernameLabel),
      "username"
    );
    userEvent.type(
      screen.getByLabelText(appStrings.loginForm.passwordLabel),
      "password"
    );
    userEvent.click(screen.getByRole("button", { name: appStrings.submit }));

    await waitFor(() =>
      screen.getByRole("heading", { name: appStrings.accounts.title })
    );
  };

  test("displays header on starting application", () => {
    renderApp();

    expect(
      screen.getByRole("heading", { name: appStrings.title })
    ).toBeInTheDocument();
  });

  test("displays login on starting application", () => {
    renderApp();

    expect(
      screen.getByRole("heading", { name: appStrings.loginForm.title })
    ).toBeInTheDocument();
  });

  test("shows toast if toast requested", async () => {
    renderApp();

    const theToast = "A toast to you my friend";

    act(() => {
      toast(theToast);
    });

    expect(await screen.findByText(theToast)).toBeInTheDocument();
  });

  test("navigates to accounts page when logged in", async () => {
    await loginToApp();

    expect(
      screen.getByRole("heading", { name: appStrings.accounts.title })
    ).toBeInTheDocument();
  });

  test("calls transactions api with id on clicking view transactions on accounts page", async () => {
    const id = "10033";

    const testTransactions = {
      accountId: parseInt(id),
      firstName: "Colin",
      lastName: "Caterpillar",
      openingBalance: 0,
      currentBalance: 100,
      transactions: [
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
      ],
    };

    const getTransactionsByAccountIdMock =
      apiTransactions.getTransactionsByAccountId as jest.MockedFunction<
        typeof apiTransactions.getTransactionsByAccountId
      >;

    getTransactionsByAccountIdMock.mockResolvedValue(testTransactions);

    await loginToApp();

    // click the second view transactions button
    const rows = await screen.findAllByRole("row");
    const buttonsCellRow2 = within(rows[2]).getAllByRole("cell")[3];
    const transactionsButton = within(buttonsCellRow2).getByRole("button", {
      name: appStrings.accounts.listButtons.viewTransactions,
    });

    userEvent.click(transactionsButton);

    expect(
      await screen.findByRole("heading", {
        name: appStrings.transactions.title,
      })
    ).toBeInTheDocument();
    expect(getTransactionsByAccountIdMock).toHaveBeenLastCalledWith(
      accountsResponse.data[1].id?.toString()
    );
  });
});
