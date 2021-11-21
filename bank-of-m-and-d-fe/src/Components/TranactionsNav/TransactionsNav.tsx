import { ITransactionsNavProps } from "../../Interfaces/Props/ITransactionsNavProps";
import "./transactionsNav.css";
import { loggedIn } from "../../tokenService/tokenService";
import { RouteComponentProps, useHistory } from "react-router-dom";

function TransactionsNav(props: ITransactionsNavProps): JSX.Element {
  const history = useHistory<RouteComponentProps>();

  const handleOpenNewTransactionModal = (): void => {
    if (!loggedIn()) {
      history.push("/");
    }
    props.openNewTransactionModal();
  };

  return (
    <div className="subNav">
      {localStorage.getItem("bearerToken") && (
        <button
          className="subNavButton"
          onClick={handleOpenNewTransactionModal}
        >
          New Transaction
        </button>
      )}
    </div>
  );
}

export default TransactionsNav;
