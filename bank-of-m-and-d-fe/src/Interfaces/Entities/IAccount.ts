export interface IAccount {
    id: number | null;
    firstName: string;
    lastName: string;
    openingBalance: number;
    currentBalance: number;
    transactions: any;
}