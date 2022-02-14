import { IAccount } from "../Entities/IAccount";

export interface IAccountsListProps {
  accountsData: IAccount[];
  accountsError: boolean;
  accountsLoading: boolean;
}
