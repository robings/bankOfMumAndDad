import { IAccountsNavProps } from "../../../Interfaces/Props/IAccountsNavProps";
import { loggedIn } from "../../../tokenHelper/tokenHelper";
import { useNavigate } from "react-router-dom";
import appStrings from "../../../constants/app.strings";

function AccountsNav(props: IAccountsNavProps): JSX.Element {
  const navigate = useNavigate();

  const handleOpenNewAccountModal = (): void => {
    if (!loggedIn()) {
      navigate("/");
    }
    props.openNewAccountModal();
  };

  return (
    <div className="subNav">
      {loggedIn() && (
        <button
          className="appButton subNavButton"
          onClick={handleOpenNewAccountModal}
        >
          {appStrings.accounts.navButtons.newAccount}
        </button>
      )}
    </div>
  );
}

export default AccountsNav;
