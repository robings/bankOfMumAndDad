import React from "react";
import Header from "./Components/Header/Header";
import TransactionsNav from "./Components/TranactionsNav/TransactionsNav";
import Transactions from "./Components/Transactions/Transactions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

function TransactionsPage() {
  let { accountId } = useParams();

  //   const [
  //     newTransactionModalVisiblity,
  //     setNewTransactionModalVisiblity,
  //   ] = useState(false);

  //   const handleCloseModal = () => {
  //     setNewTransactionModalVisiblity(false);
  //     window.location.reload();
  //   };

  return (
    <div className="App">
      <Header />
      <TransactionsNav />
      <Transactions accountId={accountId} />
      {/* {newTransactionModalVisiblity && (
        <AccountsNewForm
          newAccountModalVisibility={newTransactionModalVisiblity}
          closeModal={() => handleCloseModal()}
        />
      )} */}
      <ToastContainer />
    </div>
  );
}

export default TransactionsPage;
