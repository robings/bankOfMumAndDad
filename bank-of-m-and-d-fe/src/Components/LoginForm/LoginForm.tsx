import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LogIn } from '../../ApiService/ApiUserService';
import { ILoginDto } from '../../Interfaces/Entities/ILoginDto';
import { ILoginProps } from '../../Interfaces/Props/ILoginProps';
import { RevokeToken, SetToken } from '../../TokenService/TokenService';

function LoginForm(props: ILoginProps) {
    const [loginFormInput, setLoginFormInput] = useState<ILoginDto>({ username: '', password: ''});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value && e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = '#107C10';
        } else if (e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = '#E81123';
        }
        setLoginFormInput({
            ...loginFormInput,
            [e.currentTarget.name]: e.currentTarget.value
        })
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!loginFormInput.username || !loginFormInput.password) {
            toast.error('Please fill in missing data');
        } else {
            submitLogin(loginFormInput);
        }
    }

    async function submitLogin(loginFormInput: ILoginDto) {
        const data: any = {
            'Username': loginFormInput.username,
            'Password' : loginFormInput.password,
        }

        const response = await LogIn(data);

        if (response.status === 401) {
            toast.error('Those credentials are not correct');
            RevokeToken();
            return;
        }

        if (response.status === 200) {
            const json = await response.json();
            SetToken(json.token);
            
            props.setLoginMessage({status: 'success', message: 'Successful login'});
        } else {
            props.setLoginMessage({status: 'error', message: response.statusText});
            RevokeToken();
        }
    }

    return (
        <div className="overlay">
          <div className="modal">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
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
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      );
}

export default LoginForm;
