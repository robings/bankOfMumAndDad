import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { revokeToken, loggedIn } from "./tokenService/tokenService";
import LoginForm from "./Components/LoginForm/LoginForm";
import { IMessage } from "./Interfaces/IMessage";

function LoginPage(): JSX.Element {
  const [loginMessage, setLoginMessage] = useState<IMessage | null>(null);
  const [isLoggedIn] = useState<boolean>(loggedIn);
  const navigate = useNavigate();

  useEffect((): void => {
    if (isLoggedIn) {
      navigate("/accounts");
    }
    if (loginMessage) {
      if (loginMessage.status === "success") {
        navigate("/accounts");
      } else {
        revokeToken();
      }
    }
  }, [loginMessage, isLoggedIn, history]);

  return (
    <div className="App">
      <LoginForm setLoginMessage={setLoginMessage} />
    </div>
  );
}

export default LoginPage;
