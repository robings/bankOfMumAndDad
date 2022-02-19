import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import appStrings from "../../constants/app.strings";
import {
  IListOfTransactionsForAccount,
  TransactionType,
} from "../../Interfaces/Entities/ITransaction";
import TransactionsPage from "./TransactionsPage";
import apiTransactions from "../../api/apiTransactions";
import appliedClasses from "../../constants/appliedClasses";
import { ITransactionDto } from "../../Interfaces/Entities/ITransactionDto";
import { comment } from "postcss";

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

  const renderTransactionsPage = (
    transactionsResponse: IListOfTransactionsForAccount = testTransactionsResponse
  ) => {
    localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

    const mockGetTransactionsByAccountId =
      apiTransactions.getTransactionsByAccountId as jest.MockedFunction<
        typeof apiTransactions.getTransactionsByAccountId
      >;
    mockGetTransactionsByAccountId.mockResolvedValue(transactionsResponse);

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

    const rows = await screen.findAllByRole("row");

    Object.keys(appStrings.transactions.listTableHeaders).forEach((key) => {
      expect(
        within(rows[0]).getByRole("columnheader", {
          name: appStrings.transactions.listTableHeaders[
            key as keyof typeof appStrings.transactions.listTableHeaders
          ],
        })
      ).toBeInTheDocument();
    });
  });

  test("displays transactions data received", async () => {
    renderTransactionsPage();

    const testTransactions = testTransactionsResponse.transactions;

    const rows = await screen.findAllByRole("row");

    const cellsInStartBalanceRow = within(rows[1]).getAllByRole("cell");
    expect(cellsInStartBalanceRow[0]).toHaveTextContent(
      appStrings.transactions.startBalance
    );
    expect(cellsInStartBalanceRow[3]).toHaveTextContent(
      `${appStrings.currencySymbol}${testTransactionsResponse.openingBalance}`
    );
    expect(cellsInStartBalanceRow[3]).toHaveClass(
      appliedClasses.positiveAmount
    );

    for (let i = 2; i < rows.length - 1; i += 1) {
      const cellsInRow = within(rows[i]).getAllByRole("cell");
      expect(cellsInRow[0]).toHaveTextContent(testTransactions[i - 2].date);
      if (testTransactions[i - 2].type === TransactionType.deposit) {
        expect(cellsInRow[1]).toHaveTextContent(
          `${appStrings.currencySymbol}${testTransactions[i - 2].amount}`
        );
      } else {
        expect(cellsInRow[1]).toBeEmptyDOMElement();
      }
      if (testTransactions[i - 2].type === TransactionType.withdrawal) {
        expect(cellsInRow[2]).toHaveTextContent(
          `${appStrings.currencySymbol}${testTransactions[i - 2].amount}`
        );
      } else {
        expect(cellsInRow[2]).toBeEmptyDOMElement();
      }
      expect(cellsInRow[3]).toHaveTextContent(
        `${appStrings.currencySymbol}${testTransactions[i - 2].balance}`
      );
      expect(cellsInRow[3]).toHaveClass(appliedClasses.positiveAmount);
      expect(cellsInRow[4]).toHaveTextContent(testTransactions[i - 2].comments);
    }

    const cellsInEndBalanceRow = within(rows[5]).getAllByRole("cell");
    expect(cellsInEndBalanceRow[0]).toHaveTextContent(
      appStrings.transactions.endBalance
    );
    expect(cellsInEndBalanceRow[3]).toHaveTextContent(
      `${appStrings.currencySymbol}${testTransactionsResponse.currentBalance}`
    );
    expect(cellsInEndBalanceRow[3]).toHaveClass(appliedClasses.positiveAmount);
  });

  test("handles negative amounts", async () => {
    const transactionsResponseWithNegatives: IListOfTransactionsForAccount = {
      accountId: 10023,
      firstName,
      lastName,
      openingBalance: -100,
      currentBalance: -200,
      transactions: [
        {
          amount: 25,
          balance: -75,
          date: "2022-02-16",
          type: TransactionType.deposit,
          comments: "Deposit 1",
        },
        {
          amount: 125,
          balance: -200,
          date: "2022-02-18",
          type: TransactionType.withdrawal,
          comments: "Withdrawal",
        },
      ],
    };

    renderTransactionsPage(transactionsResponseWithNegatives);
    const testTransactions = transactionsResponseWithNegatives.transactions;

    const rows = await screen.findAllByRole("row");

    const cellsInStartBalanceRow = within(rows[1]).getAllByRole("cell");
    expect(cellsInStartBalanceRow[3]).toHaveTextContent(
      `-${appStrings.currencySymbol}${
        transactionsResponseWithNegatives.openingBalance * -1
      }`
    );
    expect(cellsInStartBalanceRow[3]).toHaveClass(
      appliedClasses.negativeAmount
    );

    const cellsInDepositRow = within(rows[2]).getAllByRole("cell");
    expect(cellsInDepositRow[3]).toHaveTextContent(
      `-${appStrings.currencySymbol}${testTransactions[0].balance * -1}`
    );
    expect(cellsInDepositRow[3]).toHaveClass(appliedClasses.negativeAmount);

    const cellsInWithdrawalRow = within(rows[3]).getAllByRole("cell");
    expect(cellsInWithdrawalRow[3]).toHaveTextContent(
      `-${appStrings.currencySymbol}${testTransactions[1].balance * -1}`
    );
    expect(cellsInWithdrawalRow[3]).toHaveClass(appliedClasses.negativeAmount);

    const cellsInEndBalanceRow = within(rows[4]).getAllByRole("cell");
    expect(cellsInEndBalanceRow[3]).toHaveTextContent(
      `-${appStrings.currencySymbol}${
        transactionsResponseWithNegatives.currentBalance * -1
      }`
    );
    expect(cellsInEndBalanceRow[3]).toHaveClass(appliedClasses.negativeAmount);
  });

  test("opens new transaction form when new transaction button clicked", async () => {
    renderTransactionsPage();

    userEvent.click(
      await screen.findByRole("button", {
        name: appStrings.transactions.navButtons.newTransaction,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: appStrings.transactions.newForm.title,
      })
    ).toBeInTheDocument();
  });

  describe("new transaction form", () => {
    const renderTransactionsPageWithNewFormOpen = async () => {
      renderTransactionsPage();

      userEvent.click(
        await screen.findByRole("button", {
          name: appStrings.transactions.navButtons.newTransaction,
        })
      );
    };

    test("shows expected inputs with default styling", async () => {
      await renderTransactionsPageWithNewFormOpen();

      const amountInput = screen.getByLabelText(
        appStrings.transactions.newForm.amount
      );
      expect(amountInput).toBeInTheDocument();
      expect(amountInput).not.toHaveClass(appliedClasses.errorBorder);
      expect(amountInput).not.toHaveClass(appliedClasses.validBorder);

      const dateInput = screen.getByLabelText(
        appStrings.transactions.newForm.date
      );
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).not.toHaveClass(appliedClasses.errorBorder);
      expect(dateInput).not.toHaveClass(appliedClasses.validBorder);

      const typeInput = screen.getByLabelText(
        appStrings.transactions.newForm.type
      );
      expect(typeInput).toBeInTheDocument();
      expect(typeInput).not.toHaveClass(appliedClasses.errorBorder);
      expect(typeInput).not.toHaveClass(appliedClasses.validBorder);

      const commentsInput = screen.getByLabelText(
        appStrings.transactions.newForm.comments
      );
      expect(commentsInput).toBeInTheDocument();
      expect(commentsInput).not.toHaveClass(appliedClasses.errorBorder);
      expect(commentsInput).not.toHaveClass(appliedClasses.validBorder);
    });

    test("displays submit button, which is disabled", async () => {
      await renderTransactionsPageWithNewFormOpen();

      expect(
        screen.getByRole("button", { name: appStrings.submit })
      ).toBeDisabled();
    });

    test("enables submit button, with valid values", async () => {
      await renderTransactionsPageWithNewFormOpen();

      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.amount),
        "100"
      );
      userEvent.clear(
        screen.getByLabelText(appStrings.transactions.newForm.date)
      );
      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.date),
        "2022-02-18"
      );

      expect(
        await screen.findByRole("button", { name: appStrings.submit })
      ).toBeEnabled();
    });

    test("calls save api with expected values", async () => {
      const mockSaveTransaction =
        apiTransactions.saveNewTransaction as jest.MockedFunction<
          typeof apiTransactions.saveNewTransaction
        >;
      mockSaveTransaction.mockResolvedValue();

      await renderTransactionsPageWithNewFormOpen();

      const amount = "100";
      const date = "2022-02-18";
      const comment = "a test comment";

      const expectedData: ITransactionDto = {
        accountId: id,
        amount: amount,
        date: new Date(date),
        type: "0",
        comments: comment,
      };

      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.amount),
        amount
      );
      userEvent.clear(
        screen.getByLabelText(appStrings.transactions.newForm.date)
      );
      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.date),
        date
      );
      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.comments),
        comment
      );

      const submitButton = await screen.findByRole("button", {
        name: appStrings.submit,
      });
      expect(submitButton).toBeEnabled();

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSaveTransaction).toHaveBeenCalledWith(expectedData);
      });
    });

    test("calls getTransactions after saving", async () => {
      const mockSaveTransaction =
        apiTransactions.saveNewTransaction as jest.MockedFunction<
          typeof apiTransactions.saveNewTransaction
        >;
      mockSaveTransaction.mockResolvedValue();

      localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

      const mockGetTransactionsByAccountId =
        apiTransactions.getTransactionsByAccountId as jest.MockedFunction<
          typeof apiTransactions.getTransactionsByAccountId
        >;
      mockGetTransactionsByAccountId.mockResolvedValue(
        testTransactionsResponse
      );

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

      userEvent.click(
        await screen.findByRole("button", {
          name: appStrings.transactions.navButtons.newTransaction,
        })
      );

      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.amount),
        "100"
      );
      userEvent.clear(
        screen.getByLabelText(appStrings.transactions.newForm.date)
      );
      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.date),
        "2022-02-18"
      );
      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.comments),
        "test comment"
      );

      const submitButton = await screen.findByRole("button", {
        name: appStrings.submit,
      });
      expect(submitButton).toBeEnabled();

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSaveTransaction).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockGetTransactionsByAccountId).toHaveBeenCalledTimes(2);
      });
    });

    test("disables form when submitting", async () => {
      localStorage.setItem(appStrings.localStorageKeys.bearerToken, "myToken");

      const mockGetTransactionsByAccountId =
        apiTransactions.getTransactionsByAccountId as jest.MockedFunction<
          typeof apiTransactions.getTransactionsByAccountId
        >;
      mockGetTransactionsByAccountId.mockResolvedValue(
        testTransactionsResponse
      );

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

      userEvent.click(
        await screen.findByRole("button", {
          name: appStrings.transactions.navButtons.newTransaction,
        })
      );

      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.amount),
        "100"
      );
      userEvent.clear(
        screen.getByLabelText(appStrings.transactions.newForm.date)
      );
      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.date),
        "2022-02-18"
      );
      userEvent.type(
        screen.getByLabelText(appStrings.transactions.newForm.comments),
        "test comment"
      );

      const submitButton = await screen.findByRole("button", {
        name: appStrings.submit,
      });
      expect(submitButton).toBeEnabled();

      userEvent.click(submitButton);

      // avoiding console warning due to Formik changes using waitFor
      await waitFor(() => {
        expect(screen.getByRole("group")).toBeDisabled();
      });
    });

    test("shows an error message indicating amount is required if amount is empty", async () => {
      await renderTransactionsPageWithNewFormOpen();

      const amountInput = screen.getByLabelText(
        appStrings.transactions.newForm.amount
      );

      userEvent.click(amountInput);
      userEvent.tab();

      expect(await screen.findByRole("listitem")).toHaveTextContent(
        appStrings.transactions.newForm.amountRequired
      );
      expect(amountInput).toHaveClass(appliedClasses.errorBorder);
    });

    const dodgyNumbers = ["word", "3word", "word3", "w0rd"];
    test.each(dodgyNumbers)(
      "displays error if value is not a number for opening balance: %p",
      async (dodgyNumber) => {
        await renderTransactionsPageWithNewFormOpen();

        const amountInput = screen.getByLabelText(
          appStrings.transactions.newForm.amount
        );

        userEvent.type(amountInput, dodgyNumber);
        userEvent.tab();

        expect(await screen.findByRole("listitem")).toHaveTextContent(
          appStrings.transactions.newForm.amountError
        );
        expect(amountInput).toHaveClass(appliedClasses.errorBorder);
      }
    );

    test("shows an error message indicating date is required if date is not set", async () => {
      await renderTransactionsPageWithNewFormOpen();

      const dateInput = screen.getByLabelText(
        appStrings.transactions.newForm.date
      );

      userEvent.click(dateInput);
      userEvent.tab();

      expect(await screen.findByRole("listitem")).toHaveTextContent(
        appStrings.transactions.newForm.dateRequired
      );
      expect(dateInput).toHaveClass(appliedClasses.errorBorder);
    });

    test("shows borders indicating fields are valid", async () => {
      await renderTransactionsPageWithNewFormOpen();

      const amountInput = screen.getByLabelText(
        appStrings.transactions.newForm.amount
      );

      userEvent.type(amountInput, "300");

      const dateInput = screen.getByLabelText(
        appStrings.transactions.newForm.date
      );

      userEvent.type(dateInput, "2022-02-14");
      userEvent.tab();

      await waitFor(() => {
        expect(amountInput).toHaveClass(appliedClasses.validBorder);
      });
      expect(dateInput).toHaveClass(appliedClasses.validBorder);
      expect(
        screen.getByLabelText(appStrings.transactions.newForm.type)
      ).toHaveClass(appliedClasses.validBorder);

      const commentsInput = screen.getByLabelText(
        appStrings.transactions.newForm.comments
      );
      expect(commentsInput).toHaveClass(appliedClasses.warningBorder);

      userEvent.type(commentsInput, "A comment");
      await waitFor(() => {
        expect(commentsInput).toHaveClass(appliedClasses.validBorder);
      });
    });

    test("shows an warning message if comments field is blank", async () => {
      await renderTransactionsPageWithNewFormOpen();

      const commentsInput = screen.getByLabelText(
        appStrings.transactions.newForm.comments
      );

      userEvent.click(commentsInput);
      userEvent.tab();

      expect(
        await screen.findByText(
          appStrings.transactions.newForm.noCommentsWarning
        )
      ).toBeInTheDocument();
      expect(commentsInput).toHaveClass(appliedClasses.warningBorder);
    });
  });
});
