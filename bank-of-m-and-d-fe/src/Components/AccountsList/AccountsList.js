import React, { useState, useEffect } from 'react';
import './accountsList.css';

function AccountsList() {
    const [data, setData] = useState([]);

    async function getAllAccounts() {
        const response = await fetch('http://localhost:55741/api/Account/all');
        const json = await response.json();

        setData(json.data);
    }

    useEffect(() => {
        getAllAccounts();
    }, []);

    return (
        <main>
            <h2>Accounts</h2>
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
        </main>
    );
}

export default AccountsList;
