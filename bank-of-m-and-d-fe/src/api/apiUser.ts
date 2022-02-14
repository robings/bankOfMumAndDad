import { toast } from 'react-toastify';
import apiStrings from "../constants/api.strings";
import { ILoginDto } from "../Interfaces/Entities/ILoginDto";
import { setToken } from "../tokenHelper/tokenHelper";
import { APIBaseUrl } from "./apiSettings";

async function login(data: ILoginDto): Promise<void> {
  const loginResponse = await toast.promise(
    async () => {
      let response;

      try {
        response = await fetch(`${APIBaseUrl}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch {
        throw new Error(apiStrings.user.error);
      }

      if (response.status >= 400 && response.status < 500) {
        throw new Error(apiStrings.user.incorrectCredentials);
      }

      if (response.status === 500) {
        throw new Error(apiStrings.user.error);
      }

      return response;
    },
    {
      pending: apiStrings.user.pending,
      success: apiStrings.user.success,
      error: {
        render({ data }: any) {
          return `${data.message}`;
        },
      },
    }
  );

  const returnedResponse: { token: string } = await loginResponse.json();

  setToken(returnedResponse.token);
}

const apiUser = {
  login,
};

export default apiUser;
