import { ITransactionDto } from "../Interfaces/Entities/ITransactionDto";
import { GetToken } from "../TokenService/TokenService";
import { APIBaseUrl } from './apiSettings';

export async function GetTransactionsByAccountId(acId: string) {
    const token = GetToken();
    
    const url = `${APIBaseUrl}/api/Transaction/${acId.toString()}`;
    
    return await fetch(url, {
    headers: {
        'Authorization': token,
    }
    });
}

export async function PostNewTransaction(data: ITransactionDto) {
    const token = GetToken();

    return await fetch(`${APIBaseUrl}/api/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data),
    });
}
