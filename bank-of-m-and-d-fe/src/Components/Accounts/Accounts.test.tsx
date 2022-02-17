import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import appStrings from "../../constants/app.strings";
import { IAccount } from "../../Interfaces/Entities/IAccount";
import { IResponse } from "../../Interfaces/Entities/IResponse";
import AccountsPage from "./AccountsPage";
import apiAccounts from "../../api/apiAccounts";
import userEvent from "@testing-library/user-event";
import { IAccountDto } from "../../Interfaces/Entities/IAccountDto";
import appliedClasses from "../../constants/appliedClasses";

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
    await waitFor(() => {
      expect(deleteAccountMock).toHaveBeenCalledWith(
        accountsResponse.data[1].id
      );
    });
  });

  test("calls getAllAccounts after deleting", async () => {
    const deleteAccountMock = apiAccounts.deleteAccount as jest.MockedFunction<
      typeof apiAccounts.deleteAccount
    >;
    deleteAccountMock.mockResolvedValue();

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

    const rows = await screen.findAllByRole("row");
    const buttonsCellRow2 = within(rows[2]).getAllByRole("cell")[3];
    const deleteButton = within(buttonsCellRow2).getByRole("button", {
      name: appStrings.accounts.listButtons.delete,
    });

    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(getAllAccountsMock).toHaveBeenCalledTimes(2);
    });
  });

  test("opens new account form on clicking new account button", async () => {
    renderAccountsPage();

    userEvent.click(
      await screen.findByRole("button", {
        name: appStrings.accounts.navButtons.newAccount,
      })
    );

    expect(
      screen.getByRole("heading", { name: appStrings.accounts.newForm.title })
    ).toBeInTheDocument();
  });

  describe("new account form", () => {
    const renderAccountsPageWithNewFormOpen = async () => {
      renderAccountsPage();

      userEvent.click(
        await screen.findByRole("button", {
          name: appStrings.accounts.navButtons.newAccount,
        })
      );
    };

    test("displays submit button, which is disabled", async () => {
      await renderAccountsPageWithNewFormOpen();

      expect(
        screen.getByRole("button", { name: appStrings.submit })
      ).toBeDisabled();
    });

    test("displays expected form inputs", async () => {
      await renderAccountsPageWithNewFormOpen();

      const firstNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.firstName
      );
      expect(firstNameInput).toBeInTheDocument();
      expect(firstNameInput).not.toHaveClass(appliedClasses.errorBorder);
      expect(firstNameInput).not.toHaveClass(appliedClasses.validBorder);

      const lastNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.lastName
      );
      expect(lastNameInput).toBeInTheDocument();
      expect(lastNameInput).not.toHaveClass(appliedClasses.errorBorder);
      expect(lastNameInput).not.toHaveClass(appliedClasses.validBorder);

      const openingBalanceInput = screen.getByLabelText(
        appStrings.accounts.newForm.openingBalance
      );
      expect(openingBalanceInput).toBeInTheDocument();
      expect(openingBalanceInput).not.toHaveClass(appliedClasses.errorBorder);
      expect(lastNameInput).not.toHaveClass(appliedClasses.validBorder);
    });

    test("displays error if no first name entered", async () => {
      await renderAccountsPageWithNewFormOpen();

      const firstNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.firstName
      );

      userEvent.click(firstNameInput);
      // tab out of field to trigger error
      userEvent.tab();

      expect(
        await screen.findByText(appStrings.accounts.newForm.firstNameError)
      ).toBeInTheDocument();
      expect(firstNameInput).toHaveClass(appliedClasses.errorBorder);
    });

    test("displays error if no last name entered", async () => {
      await renderAccountsPageWithNewFormOpen();

      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "name"
      );

      const lastNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.lastName
      );
      // click in last name field
      userEvent.click(lastNameInput);
      // tab out of field to trigger error
      userEvent.tab();

      expect(
        await screen.findByText(appStrings.accounts.newForm.lastNameError)
      ).toBeInTheDocument();
      expect(lastNameInput).toHaveClass(appliedClasses.errorBorder);
    });

    test("does not display error indicating border if another field is erroring, but focused filed is untouched", async () => {
      await renderAccountsPageWithNewFormOpen();

      // click in first name field
      userEvent.click(
        screen.getByLabelText(appStrings.accounts.newForm.firstName)
      );

      const lastNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.lastName
      );
      // click in last name field so there is an error in the first name field
      userEvent.click(lastNameInput);

      // wait for the error text to appear
      expect(
        await screen.findByText(appStrings.accounts.newForm.firstNameError)
      ).toBeInTheDocument();

      expect(lastNameInput).not.toHaveClass(appliedClasses.errorBorder);
    });

    test("displays error if there is no value for opening balance", async () => {
      await renderAccountsPageWithNewFormOpen();

      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "name"
      );
      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.lastName),
        "surname"
      );

      const openingBalanceInput = screen.getByLabelText(
        appStrings.accounts.newForm.openingBalance
      );
      // clear balance field
      userEvent.clear(openingBalanceInput);
      // tab out of field to trigger error
      userEvent.tab();

      expect(
        await screen.findByText(appStrings.accounts.newForm.openingBalanceError)
      ).toBeInTheDocument();
      expect(openingBalanceInput).toHaveClass(appliedClasses.errorBorder);
    });

    const dodgyNumbers = ["word", "3word", "word3", "w0rd"];
    test.each(dodgyNumbers)(
      "displays error if there value is not a number for opening balance: %p",
      async (dodgyNumber) => {
        await renderAccountsPageWithNewFormOpen();

        userEvent.type(
          screen.getByLabelText(appStrings.accounts.newForm.firstName),
          "name"
        );
        userEvent.type(
          screen.getByLabelText(appStrings.accounts.newForm.lastName),
          "surname"
        );

        const openingBalanceField = screen.getByLabelText(
          appStrings.accounts.newForm.openingBalance
        );
        // clear balance field
        userEvent.clear(openingBalanceField);
        // type in field
        userEvent.type(openingBalanceField, dodgyNumber);

        // tab out of field to trigger error
        userEvent.tab();

        expect(
          await screen.findByText(
            appStrings.accounts.newForm.openingBalanceError
          )
        ).toBeInTheDocument();
      }
    );

    test("displays borders indicating valid inputs with valid inputs", async () => {
      await renderAccountsPageWithNewFormOpen();

      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "person"
      );

      const lastNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.lastName
      );

      userEvent.type(lastNameInput, "name");
      // trigger validation
      userEvent.tab();

      // await to avoid console warning due to Formik updates
      expect(
        await screen.findByLabelText(appStrings.accounts.newForm.firstName)
      ).toHaveClass(appliedClasses.validBorder);
      expect(lastNameInput).toHaveClass(appliedClasses.validBorder);
      expect(
        screen.getByLabelText(appStrings.accounts.newForm.openingBalance)
      ).toHaveClass(appliedClasses.validBorder);
    });

    test("enables submit button with valid inputs", async () => {
      await renderAccountsPageWithNewFormOpen();

      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "person"
      );
      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.lastName),
        "name"
      );

      // await to avoid console warning due to Formik updates
      expect(
        await screen.findByRole("button", { name: appStrings.submit })
      ).toBeEnabled();
    });

    test("closes when close button clicked", async () => {
      await renderAccountsPageWithNewFormOpen();

      userEvent.click(
        screen.getByRole("button", { name: appStrings.closeButton })
      );

      expect(
        screen.queryByRole("heading", {
          name: appStrings.accounts.newForm.title,
        })
      ).not.toBeInTheDocument();
    });

    test("calls saveAccount api endpoint with expected data", async () => {
      const saveNewAccountMock =
        apiAccounts.saveNewAccount as jest.MockedFunction<
          typeof apiAccounts.saveNewAccount
        >;
      saveNewAccountMock.mockResolvedValue();

      await renderAccountsPageWithNewFormOpen();

      const firstName = "Bob";
      const lastName = "Dennis";
      const openingBalance = "100";

      const expectedData: IAccountDto = {
        firstName,
        lastName,
        openingBalance,
        currentBalance: openingBalance,
      };

      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        firstName
      );

      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.lastName),
        lastName
      );

      userEvent.clear(
        screen.getByLabelText(appStrings.accounts.newForm.openingBalance)
      );
      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.openingBalance),
        openingBalance
      );

      userEvent.click(screen.getByRole("button", { name: appStrings.submit }));

      // test needed this to be a wait for to work, and avoid console warnings
      // due to Formik updates
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", {
            name: appStrings.accounts.newForm.title,
          })
        ).not.toBeInTheDocument();
      });

      expect(saveNewAccountMock).toHaveBeenCalledWith(expectedData);
    });

    test("calls getAllAccounts api endpoint after saving", async () => {
      const saveNewAccountMock =
        apiAccounts.saveNewAccount as jest.MockedFunction<
          typeof apiAccounts.saveNewAccount
        >;
      saveNewAccountMock.mockResolvedValue();

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

      userEvent.click(
        await screen.findByRole("button", {
          name: appStrings.accounts.navButtons.newAccount,
        })
      );

      const firstName = "Bob";
      const lastName = "Dennis";
      const openingBalance = "100";

      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        firstName
      );

      userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.lastName),
        lastName
      );

      const openingBalanceInput = screen.getByLabelText(
        appStrings.accounts.newForm.openingBalance
      );
      userEvent.clear(openingBalanceInput);
      userEvent.type(openingBalanceInput, openingBalance);

      userEvent.click(screen.getByRole("button", { name: appStrings.submit }));

      // test needed this to be a wait for to work, and avoid console warnings
      // due to Formik updates
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", {
            name: appStrings.accounts.newForm.title,
          })
        ).not.toBeInTheDocument();
      });

      expect(getAllAccountsMock).toHaveBeenCalledTimes(2);
    });
  });
});
