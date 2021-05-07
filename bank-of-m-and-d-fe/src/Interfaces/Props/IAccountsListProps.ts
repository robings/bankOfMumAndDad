import { IAccount } from "../Entities/IAccount";
import { IMessage } from "../IMessage";

export interface IAccountsListProps{
    accountsData: IAccount[];
    accountsError: boolean;
    accountsLoading: boolean;
    setAccountsMessage(message: IMessage): void;
}
