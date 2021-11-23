import LoginPage from './LoginPage';
import AccountsPage from './AccountsPage';
import TransactionsPage from './TransactionsPage';
import { Route, Routes, Navigate } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Components/Header/Header";

function App(): JSX.Element {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/transactions/:accountId" element={<TransactionsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer transition={Slide} />
    </>
  );
}

export default App;
