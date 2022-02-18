import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { revokeToken } from "../../tokenHelper/tokenHelper";
import appStrings from "../../constants/app.strings";

export interface INavProps {
  isTransactionsPage: boolean;
}

function Nav(props: INavProps): JSX.Element {
  const [isTransactionsPage] = useState<boolean>(props.isTransactionsPage);

  const navigate = useNavigate();

  const handleLogoutClick = (): void => {
    revokeToken();
    navigate("/");
  };

  const handleHomeButtonClick = (): void => {
    navigate("/accounts");
  };

  return (
    <nav>
      <div className="headerButtons">
        <button className="appButton subNavButton" onClick={handleLogoutClick}>
          <svg
            version="1.1"
            className="svgButton"
            id="logoutButton"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 32 32"
          >
            <path
              d="M18 6 L2 6 L2 31 L18 31"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
            />
            <line
              x1="10"
              y1="19"
              x2="29"
              y2="19"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M 24 10 L32 19 L24 27 L29 19 L24 10" fill="currentColor" />
          </svg>
          <div style={{ float: "right", padding: "7px 5px" }}>
            {appStrings.navButtons.logout}
          </div>
        </button>
        {isTransactionsPage && (
          <button
            className="appButton subNavButton"
            onClick={handleHomeButtonClick}
          >
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
            <div style={{ float: "right", padding: "7px 5px" }}>
              {appStrings.navButtons.accounts}
            </div>
          </button>
        )}
      </div>
      <div>
        {localStorage.getItem("loginTime")
          ? localStorage.getItem("loginTime")
          : appStrings.notLoggedIn}
      </div>
    </nav>
  );
}

export default Nav;
