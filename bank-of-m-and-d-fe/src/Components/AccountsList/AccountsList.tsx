import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./accountsList.css";
import { IAccount } from "../../Interfaces/Entities/IAccount";
import { IResponse } from "../../Interfaces/Entities/IResponse";
import { deleteAccount } from "../../api/apiServiceAccounts";
import { IAccountsListProps } from "../../Interfaces/Props/IAccountsListProps";
import Loader from "../Loader/Loader";

function AccountsList(props: IAccountsListProps): JSX.Element {
  const data: IAccount[] = props.accountsData;
  const error: boolean = props.accountsError;
  const loading: boolean = props.accountsLoading;
  const navigate = useNavigate();

  async function handleDelete(e: React.BaseSyntheticEvent): Promise<void> {
    var data = {
      id: e.currentTarget.dataset.id,
    };

    const response: Response = await deleteAccount(data);

    if (response.status === 401) {
      props.setAccountsMessage({
        status: "error",
        message: "You are not logged in",
      });
      return;
    }

    const json: IResponse<any> = await response.json();

    if (json.success === true) {
      props.setAccountsMessage({
        status: "accountDeleted",
        message: "Account Deleted",
      });
    } else {
      toast.error(json.message);
    }
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
              <th>Last Name</th>
              <th>First Name</th>
              <th style={{ width: "150px", textAlign: "center" }}>
                Current Balance
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
                    View Transactions
                  </button>
                  <button
                    className="appButton deleteButton thinnerButton"
                    data-id={id}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div className="error">Unable to display account details.</div>}
    </main>
  );
}

export default AccountsList;
