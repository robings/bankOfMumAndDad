export function GetToken() {
    const tokenFromStorage = localStorage.getItem('bearerToken');
    return `Bearer ${tokenFromStorage}`;
}

export function SetToken(token) {
    localStorage.setItem('bearerToken', token);

    const dateNow = new Date();
            const hours = dateNow.getHours() < 10 ? `0${dateNow.getHours()}` : dateNow.getHours();
            const minutes = dateNow.getMinutes() < 10 ? `0${dateNow.getMinutes()}` : dateNow.getMinutes();

    localStorage.setItem('loginTime', `Logged in at: ${hours}:${minutes}`);
}

export function RevokeToken() {
    if (localStorage.getItem('bearerToken') !== null) {
        localStorage.removeItem('bearerToken');
    }

    if (localStorage.getItem('loginTime') !== null) {
        localStorage.removeItem('loginTime');
    }
}
