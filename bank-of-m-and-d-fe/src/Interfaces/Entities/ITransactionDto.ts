export interface ITransactionDto {
  amount: number;
  date: Date;
  type: "0" | "1";
  comments: string;
  accountId: string | undefined;
}
