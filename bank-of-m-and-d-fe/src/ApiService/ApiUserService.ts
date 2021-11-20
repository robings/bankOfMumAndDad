import { ILoginDto } from '../Interfaces/Entities/ILoginDto';
import { APIBaseUrl } from './apiSettings';

async function login (data: ILoginDto): Promise<{token: string}> {
    const response = await fetch(`${APIBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(() => {
        throw new Error("An error occured whilst attempting to log in.");
    });

    if (response.status >= 400 && response.status < 500) {
        throw new Error("Those credentials are not correct.");
    }

    if (response.status === 500) {
        throw new Error("An error occured whilst attempting to log in.");
    }

    return response.json();
};

export default {
    login,
};
