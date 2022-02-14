import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Components/Nav/Nav";
import AccountsList from "./Components/AccountsList/AccountsList";
import AccountsNav from "./Components/AccountsNav/AccountsNav";
import AccountsNewForm from "./Components/AccountsNewForm/AccountsNewForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { revokeToken, loggedIn } from "./tokenHelper/tokenHelper";
import { IMessage, MessageStatus } from "./Interfaces/IMessage";
import apiAccounts from "./api/apiAccounts";
import { IResponse } from "./Interfaces/Entities/IResponse";
import { IAccount } from "./Interfaces/Entities/IAccount";
import appStrings from "./constants/app.strings";

function AccountsPage(): JSX.Element {
  const [newAccountModalVisibility, setNewAccountModalVisibility] =
    useState<boolean>(false);
  const [accountsMessage, setAccountsMessage] = useState<IMessage | null>(null);
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

    if (accountsMessage) {
      if (accountsMessage.status === MessageStatus.success) {
        toast.success(accountsMessage.message);
      } else if (
        accountsMessage.status === MessageStatus.error &&
        accountsMessage.message === appStrings.notLoggedIn
      ) {
        revokeToken();
        toast.error(appStrings.loggedOut);
      } else if (
        accountsMessage.status === MessageStatus.accountDeleted &&
        accountsMessage.message === appStrings.accounts.accountDeleted
      ) {
        toast.info(accountsMessage.message);
      } else {
        toast.error(accountsMessage.message);
      }
    }

    return () => {
      apiAccounts.unregisterAuthErrorCallback();
    };
  }, [accountsMessage, navigate]);

  return (
    <div className="App">
      <Nav isTransactionsPage={false} />
      <AccountsNav
        openNewAccountModal={() => setNewAccountModalVisibility(true)}
      />
      <AccountsList
        accountsData={accountsData}
        accountsError={error}
        accountsLoading={loading}
        setAccountsMessage={setAccountsMessage}
      />
      {newAccountModalVisibility && (
        <AccountsNewForm
          setAccountsMessage={setAccountsMessage}
          closeModal={() => handleCloseModal()}
        />
      )}
    </div>
  );
}

export default AccountsPage;
