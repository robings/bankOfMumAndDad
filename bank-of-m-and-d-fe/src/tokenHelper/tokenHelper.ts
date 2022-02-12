import appStrings from "../constants/app.strings";

export function getToken(): string {
  const tokenFromStorage: string | null = localStorage.getItem(
    appStrings.localStorageKeys.bearerToken
  );
  return `${appStrings.tokenPrefix}${tokenFromStorage}`;
}

export function setToken(token: string): void {
  localStorage.setItem(appStrings.localStorageKeys.bearerToken, token);

  const dateNow: Date = new Date();
  const hours: string | number =
    dateNow.getHours() < 10 ? `0${dateNow.getHours()}` : dateNow.getHours();
  const minutes: string | number =
    dateNow.getMinutes() < 10
      ? `0${dateNow.getMinutes()}`
      : dateNow.getMinutes();

  localStorage.setItem(
    appStrings.localStorageKeys.loginTime,
    `${appStrings.loggedInAt} ${hours}:${minutes}`
  );
}

export function revokeToken(): void {
  if (localStorage.getItem(appStrings.localStorageKeys.bearerToken) !== null) {
    localStorage.removeItem(appStrings.localStorageKeys.bearerToken);
  }

  if (localStorage.getItem(appStrings.localStorageKeys.loginTime) !== null) {
    localStorage.removeItem(appStrings.localStorageKeys.loginTime);
  }
}

export function loggedIn(): boolean {
  if (localStorage.getItem(appStrings.localStorageKeys.bearerToken) !== null) {
    return true;
  } else {
    return false;
  }
}
