import { useState, useEffect, useCallback } from "react";
import Nav from "../Nav/Nav";
import TransactionsNav from "./TransactionsNav";
import Transactions from "./Transactions";
import TransactionsNewForm from "./TransactionsNewForm";
import { useParams, useNavigate } from "react-router-dom";
import { revokeToken, loggedIn } from "../../tokenHelper/tokenHelper";
import apiTransactions from "../../api/apiTransactions";
import { IListOfTransactionsForAccount } from "../../Interfaces/Entities/ITransaction";
import { INewTransactionFormInput } from "../../Interfaces/INewTransactionForm";
import { ITransactionDto } from "../../Interfaces/Entities/ITransactionDto";

function TransactionsPage(): JSX.Element {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [newTransactionModalVisiblity, setNewTransactionModalVisiblity] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
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

  const handleSaveTransaction = async (
    transaction: INewTransactionFormInput
  ): Promise<void> => {
    const data: ITransactionDto = {
      amount: transaction.amount,
      date: new Date(transaction.dateOfTransaction),
      type: transaction.type === "DEPOSIT" ? "0" : "1",
      comments: transaction.comments,
      accountId: accountId,
    };

    try {
      await apiTransactions.saveNewTransaction(data);
      handleCloseModal();
      await loadTransactions(accountId!);
    } catch {}
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
      setError(true);
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
      <Transactions data={transactionsData} error={error} loading={loading} />
      {newTransactionModalVisiblity && (
        <TransactionsNewForm
          onSave={handleSaveTransaction}
          closeModal={handleCloseModal}
        />
      )}
    </div>
  );
}

export default TransactionsPage;
