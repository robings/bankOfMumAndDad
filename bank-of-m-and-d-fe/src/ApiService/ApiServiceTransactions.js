import { GetToken } from "../TokenService/TokenService";

export async function GetTransactionsByAccountId(acId) {
    const token = GetToken();
    
    const url = `https://localhost:55741/api/Transaction/${acId.toString()}`;
    
    return await fetch(url, {
    headers: {
        'Authorization': token,
    }
    });
}

export async function PostNewTransaction(data) {
    const token = GetToken();

    return await fetch('https://localhost:55741/api/Transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data),
    });
}
