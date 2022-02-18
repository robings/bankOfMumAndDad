import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

function LoginPage(): JSX.Element {
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate("/accounts");
  };

  return (
    <div className="App">
      <LoginForm onSuccess={onSuccess} />
    </div>
  );
}

export default LoginPage;
