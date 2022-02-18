import LoginPage from "./Components/Login/LoginPage";
import AccountsPage from "./Components/Accounts/AccountsPage";
import TransactionsPage from "./Components/Transactions/TransactionsPage";
import { Route, Routes, Navigate } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Components/Header/Header";

function App(): JSX.Element {
  return (
    <>
      <ToastContainer transition={Slide} />
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/transactions/:accountId" element={<TransactionsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
