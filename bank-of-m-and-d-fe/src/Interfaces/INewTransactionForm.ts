import { IMessage } from "./IMessage";

export interface INewTransactionFormProps {
  accountId: string | undefined;
  closeModal(): void;
  setTransactionsMessage(message: IMessage): void;
}

export interface INewTransactionFormInput {
  amount: string;
  dateOfTransaction: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  comments: string;
}
