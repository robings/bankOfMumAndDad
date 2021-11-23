import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RevokeToken, LoggedIn } from "./tokenService/TokenService";
import LoginForm from "./Components/LoginForm/LoginForm";
import logo from "./Components/Header/m-d.jpg";
import { IMessage } from "./Interfaces/IMessage";

function LoginPage(): JSX.Element {
  const [loginMessage, setLoginMessage] = useState<IMessage | null>(null);
  const [loggedIn] = useState<boolean>(LoggedIn);
  const navigate = useNavigate();

  useEffect((): void => {
    if (loggedIn) {
      navigate("/accounts");
    }
    if (loginMessage) {
      if (loginMessage.status === "success") {
        navigate("/accounts");
      } else {
        toast.error(loginMessage.message);
        RevokeToken();
      }
    }
  }, [loginMessage, loggedIn, navigate]);

  return (
    <div className="App">
      <header>
        <section>
          <img src={logo} alt="Fraught Mum and Dad" />
          <h1>Bank Of Mum And Dad</h1>
        </section>
      </header>

      <LoginForm setLoginMessage={setLoginMessage} />
      <ToastContainer />
    </div>
  );
}

export default LoginPage;
