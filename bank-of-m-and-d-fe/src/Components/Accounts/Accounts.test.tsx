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

    const rows = await screen.findAllByRole("row");

    Object.keys(appStrings.accounts.listTableHeaders).forEach((key) => {
      expect(
        within(rows[0]).getByRole("columnheader", {
          name: appStrings.accounts.listTableHeaders[
            key as keyof typeof appStrings.accounts.listTableHeaders
          ],
        })
      ).toBeInTheDocument();
    });
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

    await userEvent.click(
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

      await userEvent.click(
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
      expect(openingBalanceInput).not.toHaveClass(appliedClasses.validBorder);
    });

    test("displays error if no first name entered", async () => {
      await renderAccountsPageWithNewFormOpen();

      const firstNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.firstName
      );

      await userEvent.click(firstNameInput);
      // tab out of field to trigger error
      userEvent.tab();

      expect(await screen.findByRole("listitem")).toHaveTextContent(
        appStrings.accounts.newForm.firstNameError
      );

      expect(firstNameInput).toHaveClass(appliedClasses.errorBorder);
    });

    test("displays error heading if there is an error", async () => {
      await renderAccountsPageWithNewFormOpen();

      await userEvent.click(
        screen.getByLabelText(appStrings.accounts.newForm.firstName)
      );
      // tab out of field to trigger error
      userEvent.tab();

      expect(
        await screen.findByRole("heading", { name: appStrings.errorBoxTitle })
      ).toBeInTheDocument();
    });

    test("displays error if no last name entered", async () => {
      await renderAccountsPageWithNewFormOpen();

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "name"
      );

      const lastNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.lastName
      );
      // click in last name field
      await userEvent.click(lastNameInput);
      // tab out of field to trigger error
      await userEvent.tab();

      expect(await screen.findByRole("listitem")).toHaveTextContent(
        appStrings.accounts.newForm.lastNameError
      );
      expect(lastNameInput).toHaveClass(appliedClasses.errorBorder);
    });

    test("does not display error indicating border if another field is erroring, but focused field is untouched", async () => {
      await renderAccountsPageWithNewFormOpen();

      // click in first name field
      await userEvent.click(
        screen.getByLabelText(appStrings.accounts.newForm.firstName)
      );

      const lastNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.lastName
      );
      // click in last name field so there is an error in the first name field
      await userEvent.click(lastNameInput);

      // wait for the error text to appear
      expect(
        await screen.findByText(appStrings.accounts.newForm.firstNameError)
      ).toBeInTheDocument();

      expect(lastNameInput).not.toHaveClass(appliedClasses.errorBorder);
    });

    test("displays error if there is no value for opening balance", async () => {
      await renderAccountsPageWithNewFormOpen();

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "name"
      );
      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.lastName),
        "surname"
      );

      const openingBalanceInput = screen.getByLabelText(
        appStrings.accounts.newForm.openingBalance
      );
      // clear balance field
      await userEvent.clear(openingBalanceInput);
      // tab out of field to trigger error
      await userEvent.tab();

      expect(await screen.findByRole("listitem")).toHaveTextContent(
        appStrings.accounts.newForm.openingBalanceRequired
      );
      expect(openingBalanceInput).toHaveClass(appliedClasses.errorBorder);
    });

    const dodgyNumbers = ["word", "3word", "word3", "w0rd"];
    test.each(dodgyNumbers)(
      "displays error if value is not a number for opening balance: %p",
      async (dodgyNumber) => {
        await renderAccountsPageWithNewFormOpen();

        await userEvent.type(
          screen.getByLabelText(appStrings.accounts.newForm.firstName),
          "name"
        );
        await userEvent.type(
          screen.getByLabelText(appStrings.accounts.newForm.lastName),
          "surname"
        );

        const openingBalanceField = screen.getByLabelText(
          appStrings.accounts.newForm.openingBalance
        );
        // clear balance field
        await userEvent.clear(openingBalanceField);
        // type in field
        await userEvent.type(openingBalanceField, dodgyNumber);

        // tab out of field to trigger error
        await userEvent.tab();

        expect(await screen.findByRole("listitem")).toHaveTextContent(
          appStrings.accounts.newForm.openingBalanceError
        );
      }
    );

    test("displays borders indicating valid inputs with valid inputs", async () => {
      await renderAccountsPageWithNewFormOpen();

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "person"
      );

      const lastNameInput = screen.getByLabelText(
        appStrings.accounts.newForm.lastName
      );

      await userEvent.type(lastNameInput, "name");
      // trigger validation
      await userEvent.tab();

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

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "person"
      );
      await userEvent.type(
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

      await userEvent.click(
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

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        firstName
      );

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.lastName),
        lastName
      );

      await userEvent.clear(
        screen.getByLabelText(appStrings.accounts.newForm.openingBalance)
      );
      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.openingBalance),
        openingBalance
      );

      await userEvent.click(
        screen.getByRole("button", { name: appStrings.submit })
      );

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

    test("disables form on save", async () => {
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

      await userEvent.click(
        await screen.findByRole("button", {
          name: appStrings.accounts.navButtons.newAccount,
        })
      );

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "Bob"
      );

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.lastName),
        "Dennis"
      );

      const openingBalanceInput = screen.getByLabelText(
        appStrings.accounts.newForm.openingBalance
      );
      await userEvent.clear(openingBalanceInput);
      await userEvent.type(openingBalanceInput, "100");

      await userEvent.click(
        screen.getByRole("button", { name: appStrings.submit })
      );

      // avoiding console warning due to Formik changes using waitFor
      await waitFor(() => {
        expect(screen.getByRole("group")).toBeDisabled();
      });
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

      await userEvent.click(
        await screen.findByRole("button", {
          name: appStrings.accounts.navButtons.newAccount,
        })
      );

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.firstName),
        "Bob"
      );

      await userEvent.type(
        screen.getByLabelText(appStrings.accounts.newForm.lastName),
        "Dennis"
      );

      const openingBalanceInput = screen.getByLabelText(
        appStrings.accounts.newForm.openingBalance
      );
      await userEvent.clear(openingBalanceInput);
      await userEvent.type(openingBalanceInput, "100");

      await userEvent.click(
        screen.getByRole("button", { name: appStrings.submit })
      );

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
