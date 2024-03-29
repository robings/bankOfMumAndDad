import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AccountsList from "./AccountsList";
import AccountsNewForm from "./AccountsNewForm";
import { revokeToken, loggedIn } from "../../tokenHelper/tokenHelper";
import apiAccounts from "../../api/apiAccounts";
import { IResponse } from "../../Interfaces/Entities/IResponse";
import { IAccount } from "../../Interfaces/Entities/IAccount";
import appStrings from "../../constants/app.strings";
import { IAccountDto } from "../../Interfaces/Entities/IAccountDto";
import { INewAccountFormInput } from "../../Interfaces/INewAccountForm";
import Header from "../Header/Header";

function AccountsPage(): JSX.Element {
  const [newAccountModalVisibility, setNewAccountModalVisibility] =
    useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [accountsData, setAccountsData] = useState<IAccount[]>([]);
  const navigate = useNavigate();

  const handleCloseModal = (): void => {
    setNewAccountModalVisibility(false);
  };

  async function onDelete(id: number | null): Promise<void> {
    if (id) {
      await apiAccounts.deleteAccount(id);
      await loadAccounts();
    }
  }

  function onViewTransactions(id: number | null): void {
    navigate(`/transactions/${id}`);
  }

  async function onSaveNew(data: INewAccountFormInput): Promise<void> {
    const dataToSend: IAccountDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      openingBalance: data.openingBalance,
      currentBalance: data.openingBalance,
    };

    try {
      await apiAccounts.saveNewAccount(dataToSend);
      handleCloseModal();
      await loadAccounts();
    } catch {}
  }

  const loadAccounts = useCallback(async (): Promise<void> => {
    setLoading(true);
    const response: IResponse<IAccount[]> = await apiAccounts.getAllAccounts();

    setAccountsData(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const redirectToLoginPage = () => {
      navigate("/");
    };

    const authErrorCallback = () => {
      revokeToken();
      setError(true);
      setLoading(false);
      redirectToLoginPage();
    };

    apiAccounts.registerAuthErrorCallback(authErrorCallback);

    if (!loggedIn()) {
      redirectToLoginPage();
    }

    loadAccounts();

    return () => {
      apiAccounts.unregisterAuthErrorCallback();
    };
  }, [navigate, loadAccounts]);

  return (
    <>
      <Header title={appStrings.accounts.title} displayPageHeader>
        <button
          className="appButton subNavButton"
          onClick={() => setNewAccountModalVisibility(true)}
        >
          {appStrings.accounts.navButtons.newAccount}
        </button>
      </Header>
      <div className="App">
        <main>
          <AccountsList
            accountsData={accountsData}
            accountsError={error}
            accountsLoading={loading}
            onDelete={onDelete}
            onViewTransactions={onViewTransactions}
          />
        </main>
        {loggedIn() && newAccountModalVisibility && (
          <AccountsNewForm closeModal={handleCloseModal} onSave={onSaveNew} />
        )}
      </div>
    </>
  );
}

export default AccountsPage;
