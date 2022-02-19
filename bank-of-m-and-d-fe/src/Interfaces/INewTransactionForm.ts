import { TransactionType } from "./Entities/ITransaction";

export interface INewTransactionFormInput {
  amount: string;
  dateOfTransaction: string;
  type: TransactionType;
  comments: string;
}
