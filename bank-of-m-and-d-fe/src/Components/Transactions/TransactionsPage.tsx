import { useState, useEffect, useCallback } from "react";
import Nav from "../Nav/Nav";
import TransactionsNav from "./TransactionsNav";
import Transactions from "./Transactions";
import TransactionsNewForm from "./TransactionsNewForm";
import { useParams, useNavigate } from "react-router-dom";
import { revokeToken, loggedIn } from "../../tokenHelper/tokenHelper";
import apiTransactions from "../../api/apiTransactions";
import { IListOfTransactionsForAccount } from "../../Interfaces/Entities/ITransaction";

function TransactionsPage(): JSX.Element {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [newTransactionModalVisiblity, setNewTransactionModalVisiblity] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<boolean>(false);
  const [noTransactions, setNoTransactions] = useState<boolean>(true);
  const [transactionsData, setTransactionsData] =
    useState<IListOfTransactionsForAccount>({
      accountId: null,
      firstName: "",
      lastName: "",
      openingBalance: 0,
      currentBalance: 0,
      transactions: [],
    });

  const loadTransactions = useCallback(
    async (accountId: string): Promise<void> => {
      setLoading(true);

      let response: IListOfTransactionsForAccount;
      try {
        response = await apiTransactions.getTransactionsByAccountId(accountId);

        setTransactionsData(response);
        setNoTransactions(false);
      } catch {
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleCloseModal = (): void => {
    setNewTransactionModalVisiblity(false);
  };

  useEffect(() => {
    const redirectToLoginPage = (): void => {
      navigate("/");
    };

    if (!loggedIn) {
      redirectToLoginPage();
    }

    const authErrorCallback = () => {
      revokeToken();
      setErrors(true);
      setLoading(false);
      redirectToLoginPage();
    };

    apiTransactions.registerAuthErrorCallback(authErrorCallback);

    if (accountId) {
      loadTransactions(accountId);
    }

    return () => {
      apiTransactions.unregisterAuthErrorCallback();
    };
  }, [navigate, loadTransactions, accountId]);

  return (
    <div className="App">
      <Nav isTransactionsPage={true} />
      <TransactionsNav
        openNewTransactionModal={() => setNewTransactionModalVisiblity(true)}
      />
      <Transactions
        transactionsData={transactionsData}
        transactionsError={errors}
        noTransactions={noTransactions}
        transactionsLoading={loading}
        setTransactionsMessage={() => {}}
      />
      {newTransactionModalVisiblity && (
        <TransactionsNewForm
          setTransactionsMessage={() => {}}
          closeModal={() => handleCloseModal()}
          accountId={accountId}
        />
      )}
    </div>
  );
}

export default TransactionsPage;
