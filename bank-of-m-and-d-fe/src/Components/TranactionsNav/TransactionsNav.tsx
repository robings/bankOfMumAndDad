import { ITransactionsNavProps } from "../../Interfaces/Props/ITransactionsNavProps";
import "./transactionsNav.css";
import { LoggedIn } from "../../tokenService/TokenService";
import { useNavigate } from "react-router-dom";

function TransactionsNav(props: ITransactionsNavProps): JSX.Element {
  const navigate = useNavigate();

  const handleOpenNewTransactionModal = (): void => {
    if (!LoggedIn()) {
      navigate("/");
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
