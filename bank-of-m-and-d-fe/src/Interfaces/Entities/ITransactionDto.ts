import { TransactionType } from "./ITransaction";

export type TransactionTypeAsString =
  | `${TransactionType.deposit}`
  | `${TransactionType.withdrawal}`;

export interface ITransactionDto {
  amount: string;
  date: Date;
  type: TransactionTypeAsString;
  comments: string;
  accountId: string | undefined;
}
