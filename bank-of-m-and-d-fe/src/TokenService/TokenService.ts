export function GetToken(): string {
    const tokenFromStorage: string | null = localStorage.getItem('bearerToken');
    return `Bearer ${tokenFromStorage}`;
}

export function SetToken(token: string): void {
    localStorage.setItem('bearerToken', token);

    const dateNow: Date = new Date();
            const hours: string | number = dateNow.getHours() < 10 ? `0${dateNow.getHours()}` : dateNow.getHours();
            const minutes: string | number = dateNow.getMinutes() < 10 ? `0${dateNow.getMinutes()}` : dateNow.getMinutes();

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

export function LoggedIn(): boolean {
    if (localStorage.getItem('bearerToken') !== null) {
        return true;
    } else {
        return false;
    }
}
