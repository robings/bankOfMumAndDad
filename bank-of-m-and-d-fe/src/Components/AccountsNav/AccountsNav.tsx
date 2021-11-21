import { IAccountsNavProps } from "../../Interfaces/Props/IAccountsNavProps";
import { loggedIn } from "../../TokenService/TokenService";
import { RouteComponentProps, useHistory } from "react-router-dom";

function AccountsNav(props: IAccountsNavProps): JSX.Element {
  const history = useHistory<RouteComponentProps>();

  const handleOpenNewAccountModal = (): void => {
    if (!loggedIn()) {
      history.push("/");
    }
    props.openNewAccountModal();
  };

  return (
    <div className="subNav">
      {localStorage.getItem("bearerToken") && (
        <button className="subNavButton" onClick={handleOpenNewAccountModal}>
          New Account
        </button>
      )}
    </div>
  );
}

export default AccountsNav;
