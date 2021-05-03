export function GetToken(): string {
    const tokenFromStorage = localStorage.getItem('bearerToken');
    return `Bearer ${tokenFromStorage}`;
}

export function SetToken(token: string): void {
    localStorage.setItem('bearerToken', token);

    const dateNow = new Date();
            const hours = dateNow.getHours() < 10 ? `0${dateNow.getHours()}` : dateNow.getHours();
            const minutes = dateNow.getMinutes() < 10 ? `0${dateNow.getMinutes()}` : dateNow.getMinutes();

    localStorage.setItem('loginTime', `Logged in at: ${hours}:${minutes}`);
}

export function RevokeToken(): void {
    if (localStorage.getItem('bearerToken') !== null) {
        localStorage.removeItem('bearerToken');
    }

    if (localStorage.getItem('loginTime') !== null) {
        localStorage.removeItem('loginTime');
    }
}

export function LoggedIn():boolean {
    if (localStorage.getItem('bearerToken') !== null) {
        return true;
    } else {
        return false;
    }
}
