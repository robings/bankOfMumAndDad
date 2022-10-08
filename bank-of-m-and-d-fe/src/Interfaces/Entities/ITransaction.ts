export interface ITransaction {
    amount: number;
    balance: number;
    date: string;
    type: number;
    comments: string;
};

export interface IListOfTransactionsForAccount {
    accountId: number | null;
    firstName: string;
    lastName: string;
    openingBalance: number;
    currentBalance: number;
    transactions: ITransaction[];
};

export enum TransactionType {
    deposit,
    withdrawal,
};
