export async function LogIn(data) {
    return await fetch('https://localhost:55741/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}
