import logo from "./../Header/m-d.jpg";

function Header(): JSX.Element {
  return (
    <header>
      <img src={logo} alt="Fraught Mum and Dad" />
      <h1>Bank Of Mum And Dad</h1>
    </header>
  );
}

export default Header;
