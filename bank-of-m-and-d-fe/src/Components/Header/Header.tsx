import appStrings from "../../constants/app.strings";
import logo from "./../Header/m-d.jpg";

function Header(): JSX.Element {
  return (
    <header>
      <img src={logo} alt={appStrings.logoAltText} />
      <h1>{appStrings.title}</h1>
    </header>
  );
}

export default Header;
