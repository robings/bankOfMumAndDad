import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import appStrings from "../../constants/app.strings";
import {
  IListOfTransactionsForAccount,
  TransactionType,
} from "../../Interfaces/Entities/ITransaction";
import TransactionsPage from "./TransactionsPage";
import apiTransactions from "../../api/apiTransactions";

jest.mock("../../api/apiTransactions");

beforeAll(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const id = "10023";
const firstName = "Colin";
const lastName = "Caterpillar";

describe("transactions page", () => {
  const testTransactionsResponse: IListOfTransactionsForAccount = {
    accountId: 10023,
    firstName,
    lastName,
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

  const renderTransactionsPage = () => {
    localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

    const mockGetTransactionsByAccountId =
      apiTransactions.getTransactionsByAccountId as jest.MockedFunction<
        typeof apiTransactions.getTransactionsByAccountId
      >;
    mockGetTransactionsByAccountId.mockResolvedValue(testTransactionsResponse);

    render(
      <MemoryRouter initialEntries={[`/transactions/${id}`]}>
        <Routes>
          <Route
            path="/transactions/:accountId"
            element={<TransactionsPage />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  test("displays title", async () => {
    renderTransactionsPage();

    expect(
      await screen.findByRole("heading", {
        name: appStrings.transactions.title,
      })
    ).toBeInTheDocument();
  });

  test("displays new transaction button", async () => {
    renderTransactionsPage();

    expect(
      await screen.findByRole("button", {
        name: appStrings.transactions.navButtons.newTransaction,
      })
    ).toBeInTheDocument();
  });

  test("displays name of account", async () => {
    renderTransactionsPage();

    const expectedName = `${firstName} ${lastName}`;

    expect(
      await screen.findByRole("heading", { name: `Name: ${expectedName}` })
    ).toBeInTheDocument();
  });

  test("displays table headings", async () => {
    renderTransactionsPage();

    const tableHeaders = await screen.findAllByRole("row");

    Object.keys(appStrings.transactions.listTableHeaders).forEach((key) => {
      expect(
        within(tableHeaders[0]).getByRole("columnheader", {
          name: appStrings.transactions.listTableHeaders[
            key as keyof typeof appStrings.transactions.listTableHeaders
          ],
        })
      ).toBeInTheDocument();
    });
  });
});
