import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './accountsList.css';
import { GetAllAccounts, DeleteAccount } from '../../ApiService/ApiServiceAccounts';
import { RevokeToken } from '../../TokenService/TokenService';


function AccountsList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const history = useHistory();

    async function getAllAccounts() {
        const response = await GetAllAccounts();
        
        if (response.status === 401) {
          RevokeToken();
          setError(true);
          setLoading(false);
          return;
        }
        
        const json = await response.json();

        setData(json.data);
        if (json.success === false) {
          toast.error(json.message);
          setError(true);
        }
        setLoading(false);
    }

    async function handleDelete(e) {
      var data = {
        id: e.currentTarget.dataset.id,
      };

      const response = await DeleteAccount(data);

      if (response.status === 401) {
        toast.error('You are not logged in.');
        RevokeToken();
        return;
      }
      
      const json = await response.json();

      if (json.success === true) {
        toast.success('Account Deleted');
        setTimeout(home, 5000);
      } else {
        toast.error(json.message);
      }
    }

    function home() {
      window.location.reload();
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
                <th>First Name</th>
                <th style={{ width: "150px", textAlign: "center" }}>Current Balance</th>
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
                      -£{(currentBalance*-1).toFixed(2)}
                    </td>
                  ) : (
                    <td style={{ textAlign: "right", color: "#009900" }}>
                      £{currentBalance.toFixed(2)}
                    </td>
                  )}
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
        {error ? <div className="error">Unable to display account details.</div> : <div></div>}
      </main>
    );
}

export default AccountsList;
