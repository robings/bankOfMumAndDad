const apiStrings = {
  user: {
    error: "An error occured whilst attempting to log in.",
    incorrectCredentials: "Those credentials are not correct.",
    pending: "logging in...",
    success: "You have been logged in.",
  },
  accounts: {
    allAccountsError:
      "An error occured whilst attempting to retrieve accounts.",
    noAccounts: "No accounts retrieved",
    saveError: "An error occured whilst attempting to save the account",
    saved: "Account saved succesfully.",
    deleteError: "An error occured whilst attempting to delete the account.",
    deleteAccountError: "Unable to delete the requested account.",
    deleted: "Account successfully deleted.",
  },
  transactions: {
    error: "An error occured whilst attempting to retrieve transactions.",
    noTransactions: "No transactions retrieved for this account.",
    noAccount: "Account information not found.",
    saveError: "An error occured whilst attempting to save the transaction.",
    saved: "Transaction saved successfully.",
  },
};

export default apiStrings;
