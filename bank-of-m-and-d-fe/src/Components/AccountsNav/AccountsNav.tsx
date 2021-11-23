import { IAccountsNavProps } from "../../Interfaces/Props/IAccountsNavProps";
import { LoggedIn } from "../../tokenService/TokenService";
import { useNavigate } from "react-router-dom";

function AccountsNav(props: IAccountsNavProps): JSX.Element {
  const navigate = useNavigate();

  const handleOpenNewAccountModal = (): void => {
    if (!LoggedIn()) {
      navigate("/");
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
