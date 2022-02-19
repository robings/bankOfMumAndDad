import React from "react";
import { useNavigate } from "react-router-dom";
import appStrings from "../../constants/app.strings";
import { loggedIn, revokeToken } from "../../tokenHelper/tokenHelper";
import logo from "./../Header/m-d.jpg";

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
  displayPageHeader: boolean;
}

const logoutIcon: JSX.Element = (
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
);

function Header(props: HeaderProps): JSX.Element {
  const { title, displayPageHeader, children } = props;

  const navigate = useNavigate();

  const onLogout = (): void => {
    revokeToken();
    navigate("/");
  };

  return (
    <>
      <header>
        <div className="headerGroup">
          <img src={logo} alt={appStrings.logoAltText} />
          <div className="loginTime">
            {localStorage.getItem("loginTime")
              ? localStorage.getItem("loginTime")
              : ""}
          </div>
        </div>
        <h1>{appStrings.title}</h1>
      </header>
      {displayPageHeader && (
        <nav>
          {title && <h2>{title}</h2>}
          <div className="headerButtons">
            {loggedIn() && (
              <>
                <button className="appButton subNavButton" onClick={onLogout}>
                  {logoutIcon}
                  <div style={{ float: "right", padding: "7px 5px" }}>
                    {appStrings.navButtons.logout}
                  </div>
                </button>
                {children !== undefined && children}
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
}

export default Header;
