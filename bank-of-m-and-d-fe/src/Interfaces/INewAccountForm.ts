import { IMessage } from "./IMessage";

export interface INewAccountFormProps {
    closeModal(): void;
    setAccountsMessage(message: IMessage): void;
}

export interface INewAccountFormInput {
    firstName: string;
    lastName: string;
    openingBalance: number | null;
}
