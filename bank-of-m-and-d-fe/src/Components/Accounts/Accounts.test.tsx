import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import appStrings from "../../constants/app.strings";
import { IAccount } from "../../Interfaces/Entities/IAccount";
import { IResponse } from "../../Interfaces/Entities/IResponse";
import AccountsPage from "./AccountsPage";
import apiAccounts from "../../api/apiAccounts";
import userEvent from "@testing-library/user-event";

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

  const renderAccountsPage = (
    accounts: IResponse<IAccount[]> = accountsResponse
  ) => {
    localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

    const getAllAccountsMock =
      apiAccounts.getAllAccounts as jest.MockedFunction<
        typeof apiAccounts.getAllAccounts
      >;
    getAllAccountsMock.mockResolvedValue(accounts);

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

  test("displays accounts data retrieved", async () => {
    renderAccountsPage();

    const rows = await screen.findAllByRole("row");

    // check first row, not header row which is index 0
    const rowOneCells = within(rows[1]).getAllByRole("cell");
    expect(rowOneCells[0]).toHaveTextContent(accountsResponse.data[0].lastName);
    expect(rowOneCells[1]).toHaveTextContent(
      accountsResponse.data[0].firstName
    );
    expect(rowOneCells[2]).toHaveTextContent(
      `£${accountsResponse.data[0].currentBalance.toString()}`
    );

    // check second row
    const rowTwoCells = within(rows[2]).getAllByRole("cell");
    expect(rowTwoCells[0]).toHaveTextContent(accountsResponse.data[1].lastName);
    expect(rowTwoCells[1]).toHaveTextContent(
      accountsResponse.data[1].firstName
    );
    expect(rowTwoCells[2]).toHaveTextContent(
      `£${accountsResponse.data[1].currentBalance.toString()}`
    );
  });

  test("displays negative balance as expected", async () => {
    const balanceNumber = 300;
    const minusBalanceAccountsResponse: IResponse<IAccount[]> = {
      success: true,
      message: "",
      data: [
        {
          id: 1,
          firstName: "Bob",
          lastName: "Cuthbert",
          openingBalance: 300,
          currentBalance: -balanceNumber,
          transactions: [],
        },
      ],
    };

    renderAccountsPage(minusBalanceAccountsResponse);

    const rows = await screen.findAllByRole("row");

    const currentBalanceCell = within(rows[1]).getAllByRole("cell")[2];
    expect(currentBalanceCell).toHaveTextContent(`-£${balanceNumber}`);
  });

  test("displays expected buttons for each row", async () => {
    renderAccountsPage();

    const rows = await screen.findAllByRole("row");

    const buttonsCellRow1 = within(rows[1]).getAllByRole("cell")[3];
    expect(
      within(buttonsCellRow1).getByRole("button", {
        name: appStrings.accounts.listButtons.delete,
      })
    ).toBeInTheDocument();
    expect(
      within(buttonsCellRow1).getByRole("button", {
        name: appStrings.accounts.listButtons.viewTransactions,
      })
    ).toBeInTheDocument();
    const buttonsCellRow2 = within(rows[2]).getAllByRole("cell")[3];
    expect(
      within(buttonsCellRow2).getByRole("button", {
        name: appStrings.accounts.listButtons.delete,
      })
    ).toBeInTheDocument();
    expect(
      within(buttonsCellRow2).getByRole("button", {
        name: appStrings.accounts.listButtons.viewTransactions,
      })
    ).toBeInTheDocument();
  });

  test("calls onDelete with expected id", async () => {
    const deleteAccountMock = apiAccounts.deleteAccount as jest.MockedFunction<
      typeof apiAccounts.deleteAccount
    >;
    deleteAccountMock.mockResolvedValue();

    renderAccountsPage();

    const rows = await screen.findAllByRole("row");
    const buttonsCellRow2 = within(rows[2]).getAllByRole("cell")[3];
    const deleteButton = within(buttonsCellRow2).getByRole("button", {
      name: appStrings.accounts.listButtons.delete,
    });

    userEvent.click(deleteButton);

    expect(deleteAccountMock).toHaveBeenCalledWith(
      accountsResponse.data[1].id?.toString()
    );
  });
});
