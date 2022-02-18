const appStrings = {
  title: "Bank of Mum and Dad",
  logoAltText: "Fraught Mum and Dad",
  missingInfoError: "Please fill in missing data.",
  errorBoxTitle: "Correct the following:",
  notLoggedIn: "You are not logged in.",
  loggedOut: "You have been logged out.",
  loggedInAt: "Logged in at:",
  submit: "Submit",
  closeButton: "X",
  currencySymbol: "£",
  localStorageKeys: {
    bearerToken: "bearerToken",
    loginTime: "loginTime",
  },
  tokenPrefix: "Bearer ",
  loginForm: {
    title: "Log In",
    usernameLabel: "Username",
    passwordLabel: "Password",
    usernameRequired: "Please enter your username.",
    passwordRequired: "Please enter your password.",
    showPassword: "Show password",
  },
  navButtons: {
    logout: "Log out",
    accounts: "Accounts",
  },
  accounts: {
    title: "Accounts",
    accountDeleted: "Account deleted.",
    listTableHeaders: {
      firstName: "First Name",
      lastName: "Last Name",
      currentBalance: "Current Balance",
    },
    listButtons: {
      viewTransactions: "View Transactions",
      delete: "Delete",
    },
    navButtons: {
      newAccount: "New Account",
    },
    error: "Unable to display account details.",
    newForm: {
      title: "New Account",
      success: "Account Created",
      firstName: "First Name",
      firstNameError: "Please enter a first name",
      lastName: "Last Name",
      lastNameError: "Please enter a last name",
      openingBalance: "Opening Balance",
      openingBalanceError: "Opening balance must be a number",
      openingBalanceRequired: "Please enter an opening balance",
    },
  },
  transactions: {
    title: "Transactions",
    navButtons: {
      newTransaction: "New Transaction",
    },
    listTableHeaders: {
      date: "Date",
      deposits: "Deposits",
      withdrawals: "Withdrawals",
      balance: "Balance",
      comments: "Comments",
    },
    startBalance: "Start Balance",
    endBalance: "End Balance",
    noTransactions: "No transactions to display",
    newForm: {
      title: "New Transaction",
      success: "Transaction recorded",
      amount: "Amount £",
      date: "Date of transaction",
      type: "Type",
      typeOptions: {
        deposit: "Deposit",
        withdrawal: "Withdrawal",
      },
      comments: "Comments",
    },
    error: "No transactions found for account.",
    accountError: "Account information not found",
  },
};

export default appStrings;
