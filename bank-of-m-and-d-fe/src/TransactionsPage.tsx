import { useState, useEffect } from "react";
import Nav from "./Components/Nav/Nav";
import TransactionsNav from "./Components/TranactionsNav/TransactionsNav";
import Transactions from "./Components/Transactions/Transactions";
import TransactionsNewForm from "./Components/TransactionsNewForm/TransactionsNewForm";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { revokeToken, loggedIn } from "./tokenHelper/tokenHelper";
import { IMessage, MessageStatus } from "./Interfaces/IMessage";
import apiTransactions from "./api/apiTransactions";
import { IResponse } from "./Interfaces/Entities/IResponse";
import {
  IListOfTransactionsForAccount,
  ITransaction,
} from "./Interfaces/Entities/ITransaction";
import appStrings from "./constants/app.strings";

function TransactionsPage(): JSX.Element {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [newTransactionModalVisiblity, setNewTransactionModalVisiblity] =
    useState<boolean>(false);
  const [transactionsMessage, setTransactionsMessage] =
    useState<IMessage | null>(null);
  const [isLoggedIn] = useState<boolean>(loggedIn);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<boolean>(false);
  const [noTransactions, setNoTransactions] = useState<boolean>(false);
  const [transactionsData, setTransactionsData] =
    useState<IListOfTransactionsForAccount>({
      accountId: null,
      firstName: "",
      lastName: "",
      openingBalance: 0,
      currentBalance: 0,
      transactions: [],
    });

  const handleCloseModal = (): void => {
    setNewTransactionModalVisiblity(false);
  };

  function processData(
    dataToConvert: IListOfTransactionsForAccount
  ): IListOfTransactionsForAccount {
    const convertedTransactions: ITransaction[] = dataToConvert.transactions;

    convertedTransactions.forEach((transaction) => {
      transaction.date = transaction.date.split("T")[0].trim();
    });

    const convertedData: IListOfTransactionsForAccount = {
      accountId: dataToConvert.accountId,
      firstName: dataToConvert.firstName,
      lastName: dataToConvert.lastName,
      openingBalance: dataToConvert.openingBalance,
      currentBalance: dataToConvert.currentBalance,
      transactions: convertedTransactions,
    };
    return convertedData;
  }

  useEffect((): void => {
    const redirectToLoginPage = (): void => {
      navigate("/");
    };

    if (!isLoggedIn) {
      redirectToLoginPage();
    }

    async function loadTransactions(acId: string): Promise<void> {
      const response: Response =
        await apiTransactions.getTransactionsByAccountId(acId);

      if (response.status === 401) {
        toast.error(appStrings.notLoggedIn);
        revokeToken();
        setErrors(true);
        setLoading(false);
        setTimeout(redirectToLoginPage, 5000);
        return;
      }

      const json: IResponse<IListOfTransactionsForAccount> =
        await response.json();

      if (
        json.success === false &&
        json.message !== appStrings.transactions.error
      ) {
        toast.error(appStrings.transactions.accountError);
        setErrors(true);
      }

      if (
        json.success === false &&
        json.message === appStrings.transactions.error
      ) {
        toast.info(json.message);
        setNoTransactions(true);
      }

      if (json.success) {
        const processedData: IListOfTransactionsForAccount = processData(
          json.data
        );
        setTransactionsData(processedData);
      }

      setLoading(false);
    }

    setLoading(true);

    if (accountId) {
      loadTransactions(accountId);
    }

    if (transactionsMessage) {
      if (transactionsMessage.status === MessageStatus.success) {
        toast.success(transactionsMessage.message);
        setErrors(false);
        setNoTransactions(false);
      } else if (
        transactionsMessage.status === MessageStatus.error &&
        transactionsMessage.message === appStrings.notLoggedIn
      ) {
        revokeToken();
        toast.error(appStrings.loggedOut);
        setTimeout(redirectToLoginPage, 5000);
      } else if (transactionsMessage.status === MessageStatus.error) {
        toast.error(transactionsMessage.message);
      }
    }
  }, [transactionsMessage, navigate, isLoggedIn, accountId]);

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
        setTransactionsMessage={setTransactionsMessage}
      />
      {newTransactionModalVisiblity && (
        <TransactionsNewForm
          setTransactionsMessage={setTransactionsMessage}
          closeModal={() => handleCloseModal()}
          accountId={accountId}
        />
      )}
    </div>
  );
}

export default TransactionsPage;
