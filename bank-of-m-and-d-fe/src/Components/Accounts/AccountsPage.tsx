import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import AccountsList from "./AccountsList/AccountsList";
import AccountsNav from "./AccountsNav/AccountsNav";
import AccountsNewForm from "./AccountsNewForm/AccountsNewForm";
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

    async function loadAccounts(): Promise<void> {
      setLoading(true);
      const response: IResponse<IAccount[]> =
        await apiAccounts.getAllAccounts();

      setAccountsData(response.data);
      setLoading(false);
    }

    loadAccounts();

    return () => {
      apiAccounts.unregisterAuthErrorCallback();
    };
  }, [navigate]);

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
        />
      </main>
      {newAccountModalVisibility && (
        <AccountsNewForm closeModal={() => handleCloseModal()} />
      )}
    </div>
  );
}

export default AccountsPage;
