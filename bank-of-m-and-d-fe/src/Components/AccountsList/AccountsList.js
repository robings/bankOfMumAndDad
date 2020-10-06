import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import './accountsList.css';


function AccountsList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const history = useHistory();

    async function getAllAccounts() {
        const response = await fetch('https://localhost:55741/api/Account/all');
        const json = await response.json();

        setData(json.data);
        if (json.success === false) {
          setError(json.message);
        }
        setLoading(false);
    }

    async function handleDelete(e) {
      var data = {
        id: e.currentTarget.dataset.id,
      };

      const response = await fetch("https://localhost:55741/api/Account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();

      if (json.success === true) {
        toast.success("Account Deleted");
      } else {
        toast.error(json.message);
      }
    }

    function handleViewTransactions(e) {
      let urlParam = e.currentTarget.dataset.id;
      history.push(`/transactions/${urlParam}`);
    }

    useEffect(() => {
        getAllAccounts();
    }, []);

    return (
      <main>
        <h2>Accounts</h2>
        {loading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Last Name</th>
                <th>FirstName</th>
                <th>Current Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ id, firstName, lastName, currentBalance }) => (
                <tr className="data" key={id}>
                  <td>{lastName}</td>
                  <td>{firstName}</td>
                  <td>£{currentBalance}</td>
                  <td>
                    <button data-id={id} onClick={handleViewTransactions}>
                      View Transactions
                    </button>
                    <button
                      className="deleteButton"
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
        {error ? <div className="error">Opps {error}</div> : <div></div>}
      </main>
    );
}

export default AccountsList;
