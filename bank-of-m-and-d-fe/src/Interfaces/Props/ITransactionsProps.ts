import { IListOfTransactionsForAccount } from "../Entities/ITransaction";
import { IMessage } from "../IMessage";

export interface ITransactionProps {
  transactionsData: IListOfTransactionsForAccount;
  transactionsError: boolean;
  noTransactions: boolean;
  transactionsLoading: boolean;
  setTransactionsMessage(message: IMessage): void;
}
