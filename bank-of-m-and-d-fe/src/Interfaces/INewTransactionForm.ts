export interface INewTransactionFormInput {
  amount: string;
  dateOfTransaction: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  comments: string;
}
