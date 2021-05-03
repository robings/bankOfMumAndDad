import { ILoginDto } from '../Interfaces/Entities/ILoginDto';
import { APIBaseUrl } from './apiSettings';

export async function LogIn(data: ILoginDto) {
    return await fetch(`${APIBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}
