export async function GetTransactionsByAccountId(acId) {
    const tokenFromStorage = localStorage.getItem('bearerToken');
    const token = `Bearer ${tokenFromStorage}`;
    
    const url = `https://localhost:55741/api/Transaction/${acId.toString()}`;
    
    return await fetch(url, {
    headers: {
        'Authorization': token,
    }
    });
}

export async function PostNewTransaction(data) {
    const tokenFromStorage = localStorage.getItem('bearerToken');
    const token = `Bearer ${tokenFromStorage}`;

    return await fetch('https://localhost:55741/api/Transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data),
    });
}
