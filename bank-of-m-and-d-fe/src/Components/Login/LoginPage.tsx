import { useNavigate } from "react-router-dom";
import apiUser from "../../api/apiUser";
import { ILoginDto } from "../../Interfaces/Entities/ILoginDto";
import { revokeToken } from "../../tokenHelper/tokenHelper";
import Header from "../Header/Header";
import LoginForm from "./LoginForm";

function LoginPage(): JSX.Element {
  const navigate = useNavigate();

  async function onSubmit(loginFormInput: ILoginDto) {
    try {
      await apiUser.login(loginFormInput);
      setTimeout(() => navigate("/accounts"), 1000);
    } catch {
      revokeToken();
    }
  }

  return (
    <>
      <Header displayPageHeader={false} />
      <div className="App">
        <LoginForm onSubmit={onSubmit} />
      </div>
    </>
  );
}

export default LoginPage;
