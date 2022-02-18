import { loggedIn } from "../../tokenHelper/tokenHelper";
import { useNavigate } from "react-router-dom";
import appStrings from "../../constants/app.strings";

export interface ITransactionsNavProps {
  openNewTransactionModal(): void;
}

function TransactionsNav(props: ITransactionsNavProps): JSX.Element {
  const navigate = useNavigate();

  const handleOpenNewTransactionModal = (): void => {
    if (!loggedIn()) {
      navigate("/");
    }
    props.openNewTransactionModal();
  };

  return (
    <div className="subNav">
      {loggedIn() && (
        <button
          className="appButton subNavButton"
          onClick={handleOpenNewTransactionModal}
        >
          {appStrings.transactions.navButtons.newTransaction}
        </button>
      )}
    </div>
  );
}

export default TransactionsNav;
