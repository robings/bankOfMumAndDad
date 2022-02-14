import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import appStrings from "../../constants/app.strings";
import { IAccount } from "../../Interfaces/Entities/IAccount";
import { IResponse } from "../../Interfaces/Entities/IResponse";
import AccountsPage from "./AccountsPage";
import apiAccounts from "../../api/apiAccounts";

jest.mock("../../api/apiAccounts");

beforeAll(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("accounts page", () => {
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

  const renderAccountsPage = () => {
    localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

    const getAllAccountsMock =
      apiAccounts.getAllAccounts as jest.MockedFunction<
        typeof apiAccounts.getAllAccounts
      >;
    getAllAccountsMock.mockResolvedValue(accountsResponse);

    render(
      <MemoryRouter initialEntries={["/accounts"]}>
        <AccountsPage />
      </MemoryRouter>
    );
  };

  test("displays title", async () => {
    renderAccountsPage();

    expect(
      await screen.findByRole("heading", { name: appStrings.accounts.title })
    ).toBeInTheDocument();
  });

  test("displays new account button", async () => {
    renderAccountsPage();

    expect(
      await screen.findByRole("button", {
        name: appStrings.accounts.navButtons.newAccount,
      })
    ).toBeInTheDocument();
  });

  test("displays table headings", async () => {
    renderAccountsPage();

    const tableHeaders = await screen.findAllByRole("row");

    expect(
      within(tableHeaders[0]).getByRole("columnheader", {
        name: appStrings.accounts.listTableHeaders.currentBalance,
      })
    ).toBeInTheDocument();
    expect(
      within(tableHeaders[0]).getByRole("columnheader", {
        name: appStrings.accounts.listTableHeaders.firstName,
      })
    ).toBeInTheDocument();
    expect(
      within(tableHeaders[0]).getByRole("columnheader", {
        name: appStrings.accounts.listTableHeaders.lastName,
      })
    ).toBeInTheDocument();
  });
});
