export interface ITransactionDto {
  amount: string;
  date: Date;
  type: "0" | "1";
  comments: string;
  accountId: string | undefined;
}
