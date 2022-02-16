import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import AccountsList from "./AccountsList";
import AccountsNav from "./AccountsNav";
import AccountsNewForm from "./AccountsNewForm";
import "react-toastify/dist/ReactToastify.css";
import { revokeToken, loggedIn } from "../../tokenHelper/tokenHelper";
import apiAccounts from "../../api/apiAccounts";
import { IResponse } from "../../Interfaces/Entities/IResponse";
import { IAccount } from "../../Interfaces/Entities/IAccount";
import appStrings from "../../constants/app.strings";

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
    <div className="App">
      <Nav isTransactionsPage={false} />
      <AccountsNav
        openNewAccountModal={() => setNewAccountModalVisibility(true)}
      />
      <main>
        <h2>{appStrings.accounts.title}</h2>
        <AccountsList
          accountsData={accountsData}
          accountsError={error}
          accountsLoading={loading}
          onDelete={onDelete}
          onViewTransactions={onViewTransactions}
        />
      </main>
      {newAccountModalVisibility && (
        <AccountsNewForm closeModal={() => handleCloseModal()} />
      )}
    </div>
  );
}

export default AccountsPage;
