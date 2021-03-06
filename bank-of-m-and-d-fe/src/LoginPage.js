import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RevokeToken, LoggedIn } from "./TokenService/TokenService";
import LoginForm from "./Components/LoginForm/LoginForm";
import logo from './Components/Header/m-d.jpg';

function LoginPage(){
    const [loginMessage, setLoginMessage] = useState({});
    const [loggedIn] = useState(LoggedIn);
    const history = useHistory();

    useEffect (()=>{
        if (loggedIn){
            loggedInPageRedirect();
        }
        if (loginMessage) {
          if (loginMessage.status === 'success'){
            loggedInPageRedirect();
          }
          else {
            toast.error(loginMessage.message);
            RevokeToken();
          }
        }
      }, [loginMessage])

    function loggedInPageRedirect() {
        history.push('/accounts');
    }

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
                    loginModalVisibility={true}
                    setLoginMessage={setLoginMessage}
                    closeModal={null}
                    />
          <ToastContainer />
        </div>
      );
}

export default LoginPage;
