import { ITransactionsNavProps } from "../../Interfaces/Props/ITransactionsNavProps";
import "./transactionsNav.css";
import { loggedIn } from "../../tokenService/tokenService";
import { useNavigate } from "react-router-dom";

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
          New Transaction
        </button>
      )}
    </div>
  );
}

export default TransactionsNav;
