import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RevokeToken, LoggedIn } from "./TokenService/TokenService";
import LoginForm from "./Components/LoginForm/LoginForm";
import logo from './Components/Header/m-d.jpg';
import { IMessage } from "./Interfaces/IMessage";

function LoginPage(){
    const [loginMessage, setLoginMessage] = useState<IMessage | null>(null);
    const [loggedIn] = useState(LoggedIn);
    const history = useHistory();

    useEffect (()=>{
        if (loggedIn){
          history.push('/accounts');
        }
        if (loginMessage) {
          if (loginMessage.status === 'success'){
            history.push('/accounts');
          }
          else {
            toast.error(loginMessage.message);
            RevokeToken();
          }
        }
      }, [loginMessage, loggedIn, history])


    return (
        <div className="App">
          <header>
            <section>
            <img src={logo} alt="Fraught Mum and Dad" />
            <h1>
                Bank Of Mum And Dad
            </h1>
            </section>
          </header>

          <LoginForm
                    setLoginMessage={setLoginMessage}
                    />
          <ToastContainer />
        </div>
      );
}

export default LoginPage;
