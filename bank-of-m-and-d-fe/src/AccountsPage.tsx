import { useState, useEffect } from "react";
import { useHistory, RouteComponentProps } from "react-router-dom";
import Nav from "./Components/Nav/Nav";
import AccountsList from "./Components/AccountsList/AccountsList";
import AccountsNav from "./Components/AccountsNav/AccountsNav";
import AccountsNewForm from "./Components/AccountsNewForm/AccountsNewForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { revokeToken, loggedIn } from "./TokenService/TokenService";
import { IMessage } from "./Interfaces/IMessage";
import { GetAllAccounts } from "./ApiService/ApiServiceAccounts";
import { IResponse } from "./Interfaces/Entities/IResponse";
import { IAccount } from "./Interfaces/Entities/IAccount";

function AccountsPage(): JSX.Element {
  const [newAccountModalVisibility, setNewAccountModalVisibility] =
    useState<boolean>(false);
  const [accountsMessage, setAccountsMessage] = useState<IMessage | null>(null);
  const [isLoggedIn] = useState<boolean>(loggedIn);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [accountsData, setAccountsData] = useState<IAccount[]>([]);
  const history = useHistory<RouteComponentProps>();

  const handleCloseModal = (): void => {
    setNewAccountModalVisibility(false);
  };

  useEffect((): void => {
    const redirectToLoginPage = () => {
      history.push("/");
    };

    if (!isLoggedIn) {
      redirectToLoginPage();
    }

    async function getAllAccounts(): Promise<void> {
      const response: Response = await GetAllAccounts();

      if (response.status === 401) {
        revokeToken();
        setError(true);
        setLoading(false);
        setTimeout(redirectToLoginPage, 5000);
        return;
      }

      if (
        !response.status ||
        response.status === null ||
        response.status === 500
      ) {
        setError(true);
        setLoading(false);
        return;
      }

      const json: IResponse<IAccount[]> = await response.json();

      setAccountsData(json.data);
      if (json.success === false) {
        toast.error(json.message);
        setError(true);
      }
      setLoading(false);
    }

    setLoading(true);
    getAllAccounts();

    if (accountsMessage) {
      if (accountsMessage.status === "success") {
        toast.success(accountsMessage.message);
      } else if (
        accountsMessage.status === "error" &&
        accountsMessage.message === "You are not logged in"
      ) {
        revokeToken();
        toast.error("For your security, you have been logged out");
        setTimeout(redirectToLoginPage, 5000);
      } else if (
        accountsMessage.status === "accountDeleted" &&
        accountsMessage.message === "Account Deleted"
      ) {
        toast.info(accountsMessage.message);
      } else {
        toast.error(accountsMessage.message);
      }
    }
  }, [accountsMessage, isLoggedIn, history]);

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
