import { IMessage } from "./IMessage";

export interface INewTransactionFormProps {
  accountId: string | undefined;
  closeModal(): void;
  setTransactionsMessage(message: IMessage): void;
}

export interface INewTransactionFormInput {
    amount: number | null;
    dateOfTransaction: Date | null;
    type: 'DEPOSIT' | 'WITHDRAWAL';
    comments: string;
}
