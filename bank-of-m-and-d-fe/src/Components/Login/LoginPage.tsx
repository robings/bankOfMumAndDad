import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import LoginForm from "./LoginForm";

function LoginPage(): JSX.Element {
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate("/accounts");
  };

  return (
    <>
      <Header displayPageHeader={false} />
      <div className="App">
        <LoginForm onSuccess={onSuccess} />
      </div>
    </>
  );
}

export default LoginPage;
