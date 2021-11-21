import { useState, useEffect } from "react";
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { revokeToken, loggedIn } from "./TokenService/TokenService";
import LoginForm from "./Components/LoginForm/LoginForm";
import { IMessage } from "./Interfaces/IMessage";

function LoginPage(): JSX.Element {
  const [loginMessage, setLoginMessage] = useState<IMessage | null>(null);
  const [isLoggedIn] = useState<boolean>(loggedIn);
  const history = useHistory<RouteComponentProps>();

  useEffect((): void => {
    if (isLoggedIn) {
      history.push("/accounts");
    }
    if (loginMessage) {
      if (loginMessage.status === "success") {
        history.push("/accounts");
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
