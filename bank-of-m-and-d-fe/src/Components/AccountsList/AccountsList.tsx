import React from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./accountsList.css";
import { IAccount } from "../../Interfaces/Entities/IAccount";
import apiAccounts from "../../api/apiAccounts";
import { IAccountsListProps } from "../../Interfaces/Props/IAccountsListProps";
import Loader from "../Loader/Loader";
import appStrings from "../../constants/app.strings";

function AccountsList(props: IAccountsListProps): JSX.Element {
  const data: IAccount[] = props.accountsData;
  const error: boolean = props.accountsError;
  const loading: boolean = props.accountsLoading;
  const navigate = useNavigate();

  async function handleDelete(e: React.BaseSyntheticEvent): Promise<void> {
    await apiAccounts.deleteAccount(e.currentTarget.dataset.id);
  }

  function handleViewTransactions(e: React.BaseSyntheticEvent): void {
    let urlParam = e.currentTarget.dataset.id;
    navigate(`/transactions/${urlParam}`);
  }

  return (
    <main>
      <h2>Accounts</h2>
      {loading && !error ? (
        <Loader />
      ) : (
        <table>
          <thead>
            <tr>
              <th>{appStrings.accounts.listTableHeaders.lastName}</th>
              <th>{appStrings.accounts.listTableHeaders.firstName}</th>
              <th style={{ width: "150px", textAlign: "center" }}>
                {appStrings.accounts.listTableHeaders.currentBalance}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, firstName, lastName, currentBalance }) => (
              <tr className="data" key={id}>
                <td>{lastName}</td>
                <td>{firstName}</td>
                {currentBalance < 0 ? (
                  <td style={{ textAlign: "right", color: "#FF0000" }}>
                    -£{(currentBalance * -1).toFixed(2)}
                  </td>
                ) : (
                  <td style={{ textAlign: "right", color: "#009900" }}>
                    £{currentBalance.toFixed(2)}
                  </td>
                )}
                <td>
                  <button
                    className="appButton thinnerButton"
                    data-id={id}
                    onClick={handleViewTransactions}
                  >
                    {appStrings.accounts.listButtons.viewTransactions}
                  </button>
                  <button
                    className="appButton deleteButton thinnerButton"
                    data-id={id}
                    onClick={handleDelete}
                  >
                    {appStrings.accounts.listButtons.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div className="error">{appStrings.accounts.error}</div>}
    </main>
  );
}

export default AccountsList;
