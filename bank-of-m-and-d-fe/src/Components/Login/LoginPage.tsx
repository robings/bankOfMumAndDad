import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { revokeToken } from "../../tokenHelper/tokenHelper";
import LoginForm from "./LoginForm";
import { IMessage, MessageStatus } from "../../Interfaces/IMessage";

function LoginPage(): JSX.Element {
  const [loginMessage, setLoginMessage] = useState<IMessage | null>(null);
  const navigate = useNavigate();

  useEffect((): void => {
    if (loginMessage) {
      if (loginMessage.status === MessageStatus.success) {
        navigate("/accounts");
      } else {
        revokeToken();
      }
    }
  }, [loginMessage, navigate]);

  return (
    <div className="App">
      <LoginForm setLoginMessage={setLoginMessage} />
    </div>
  );
}

export default LoginPage;
