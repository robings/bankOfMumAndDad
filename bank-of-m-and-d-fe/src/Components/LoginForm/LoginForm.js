import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginForm(props) {
    const [loginFormInput, setLoginFormInput] = useState([{}]);
    const [loginAttempts, setLoginAttempts] = useState(0);

    const handleInputChange = (e) => {
        if (e.currentTarget.value && e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = '#999999';
        } else if (e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = 'FF0000';
        }
        setLoginFormInput({
            ...loginFormInput,
            [e.currentTarget.name]: e.currentTarget.value
        })
    };

    function handleSubmit(event) {
        event.preventDefault();
        if (!loginFormInput.username || !loginFormInput.password) {
            toast.error('Please fill in missing data');
        } else {
            var updatedLoginAttempts = loginAttempts + 1
            setLoginAttempts(updatedLoginAttempts);
            submitLogin(loginFormInput);
        }
    }

    async function submitLogin(loginFormInput) {
        if (loginAttempts > 4) {
          props.setLoginMessage({status: 'error', message: 'Too many login attempts'});
          props.closeModal();
          return;
        }
        
        const data = {
            'Username': loginFormInput.username,
            'Password' : loginFormInput.password,
        }

        const response = await fetch('https://localhost:55741/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            toast.error('Incorrect Login Details');
            if (localStorage.getItem('bearerToken') !== null) {
              localStorage.removeItem('bearerToken');
            }
            return;
        }

        if (response.status === 200) {
            const json = await response.json();
            localStorage.setItem('bearerToken', json.token)
            props.setLoginMessage({status: 'success', message: 'Successful login'});
            props.closeModal();
        } else {
            props.setLoginMessage({status: 'error', message: response.statusText});
            if (localStorage.getItem('bearerToken') !== null) {
              localStorage.removeItem('bearerToken');
            }
            props.closeModal();
        }
    }

    return (
        <div className="overlay">
          <div className="modal">
            <button className="closeButton" onClick={props.closeModal}>
              X
            </button>
            <h1>Login</h1>
            <form>
              <div>
                <label>Username</label>
                <input
                  className="redBorder"
                  type="text"
                  name="username"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  className="redBorder"
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                />
              </div>
            </form>
            <button
           
           
                  onClick={handleSubmit}
        
        
                        style={{ marginTop: "10px" }}
            
            
            >
              Submit
            </button>
            {loginAttempts > 1 && (<div style={{ textAlign: "center" }}>Login Attempts {loginAttempts}</div>)}
          </div>
        </div>
      );
}

export default LoginForm;
