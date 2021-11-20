import { toast } from 'react-toastify';
import { ILoginDto } from '../Interfaces/Entities/ILoginDto';
import { APIBaseUrl } from './apiSettings';

async function login (data: ILoginDto): Promise<{token: string}> {
    const loginResponse = await toast.promise(async () => {
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
        };

        return response;
    },
        {
            pending: 'logging in...',
            success: 'You have been logged in',
            error: {
                render({data}: any) {
                    return `${data.message}`
                },
            }
        }
    );

    return loginResponse.json();
};

const api = {
    login
};


export default api;
