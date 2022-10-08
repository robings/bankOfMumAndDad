import { useState, useEffect, useCallback } from "react";
import Transactions from "./Transactions";
import TransactionsNewForm from "./TransactionsNewForm";
import { useParams, useNavigate } from "react-router-dom";
import { revokeToken, loggedIn } from "../../tokenHelper/tokenHelper";
import apiTransactions from "../../api/apiTransactions";
import { IListOfTransactionsForAccount } from "../../Interfaces/Entities/ITransaction";
import { INewTransactionFormInput } from "../../Interfaces/INewTransactionForm";
import {
  ITransactionDto,
  TransactionTypeAsString,
} from "../../Interfaces/Entities/ITransactionDto";
import Header from "../Header/Header";
import appStrings from "../../constants/app.strings";

const accountsIcon: JSX.Element = (
  <svg
    version="1.1"
    className="svgButton"
    id="homeButton"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 32 32"
  >
    <path
      d="M 0 20 L16 4 L32 20 L31 22 L16 7 L1 22 L0 20"
      fill="currentColor"
    />
    <path
      d="M 4 17 L4 32 L28 32 L28 17 L26 16 L26 30 L6 30 L6 16 L4 17"
      fill="currentColor"
    />
    <path
      d="M 24 14 L24 4 L20 4 L20 10 L24 14"
      stroke="currentColor"
      fill="transparent"
    />
    <rect
      x="8"
      y="20"
      width="6"
      height="6"
      stroke="currentColor"
      fill="transparent"
    />
    <rect
      x="18"
      y="20"
      width="6"
      height="9"
      stroke="currentColor"
      fill="transparent"
    />
  </svg>
);

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

  const onAccountsClick = () => {
    navigate("/accounts");
  };

  const handleSaveTransaction = async (
    transaction: INewTransactionFormInput
  ): Promise<void> => {
    const data: ITransactionDto = {
      amount: transaction.amount,
      date: new Date(transaction.dateOfTransaction),
      type: transaction.type.toString() as TransactionTypeAsString,
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
    <>
      <Header title={appStrings.transactions.title} displayPageHeader>
        <button className="appButton subNavButton" onClick={onAccountsClick}>
          {accountsIcon}
          <div style={{ float: "right", padding: "7px 5px" }}>
            {appStrings.navButtons.accounts}
          </div>
        </button>

        <button
          className="appButton subNavButton"
          onClick={() => setNewTransactionModalVisiblity(true)}
        >
          {appStrings.transactions.navButtons.newTransaction}
        </button>
      </Header>
      <div className="App">
        <Transactions data={transactionsData} error={error} loading={loading} />
        {newTransactionModalVisiblity && (
          <TransactionsNewForm
            onSave={handleSaveTransaction}
            closeModal={handleCloseModal}
          />
        )}
      </div>
    </>
  );
}

export default TransactionsPage;
