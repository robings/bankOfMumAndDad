import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import './accountsList.css';


function AccountsList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getAllAccounts() {
        const response = await fetch('http://localhost:55741/api/Account/all');
        const json = await response.json();

        setData(json.data);
        setLoading(false);
    }

    useEffect(() => {
        getAllAccounts();
    }, []);

    return (
        <main>
            <h2>Accounts</h2>
            {loading ? (<Loader />) : 
                <table>
                    <thead>
                        <tr><th>Last Name</th><th>FirstName</th><th>Current Balance</th></tr>
                    </thead>
                    <tbody>
                        {data.map(({ id, firstName, lastName, currentBalance }) => (
                            <tr className='data' key={id}>
                                <td>{lastName}</td>
                                <td>{firstName}</td>
                                <td>£{currentBalance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </main>
    );
}

export default AccountsList;
