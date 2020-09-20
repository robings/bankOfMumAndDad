import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import './transactions.css';


function Transactions() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getTransactions(accountId) {
        const url = `http://localhost:55741/api/Transaction/${accountId}`
        const response = await fetch(url);
        const json = await response.json();

        setData(json.data);
        setLoading(false);
    }

    useEffect(() => {
        getTransactions('10024');
    }, []);

    return (
        <main>
            <h2>Transactions</h2>
            <h3>Name</h3>
            {loading ? (<Loader />) :
                <table>
                    <thead>
                        <tr><th>Date</th><th>Type</th><th>Amount</th><th>New Balance</th></tr>
                        {data.map(({ id, amount, date, type }) =>
                            <tr className='data' key={id}>
                                <td>{date}</td>
                                <td>{type === 0 ? "Deposit" : "Withdrawal"}</td>
                                <td>£{amount}</td>
                                <td></td>
                            </tr>
                        )}
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            }
        </main>
    );
}

export default Transactions;