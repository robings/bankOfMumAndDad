export async function GetAllAccounts() {
    const tokenFromStorage = localStorage.getItem('bearerToken');
    const token = `Bearer ${tokenFromStorage}`;

    return await fetch('https://localhost:55741/api/Account/all', {
      headers: {
          'Authorization': token,
      }
    });
}

export async function GetAccountById(acId) {
  const tokenFromStorage = localStorage.getItem('bearerToken');
      const token = `Bearer ${tokenFromStorage}`;

      const accountUrl = `https://localhost:55741/api/Account/${acId.toString()}`;
      return await fetch(accountUrl, {
        headers: {
            'Authorization': token,
        }
      });
}

export async function PostNewAccount(data) {
  const tokenFromStorage = localStorage.getItem('bearerToken');
  const token = `Bearer ${tokenFromStorage}`;

  return await fetch('https://localhost:55741/api/Account', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
      },
      body: JSON.stringify(data)
  });
}

export async function DeleteAccount(data) {
  const tokenFromStorage = localStorage.getItem('bearerToken');
      const token = `Bearer ${tokenFromStorage}`;

      return await fetch('https://localhost:55741/api/Account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(data),
      });
}
