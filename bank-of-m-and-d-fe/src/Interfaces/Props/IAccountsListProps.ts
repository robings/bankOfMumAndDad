import { IAccount } from "../Entities/IAccount";
import { IMessage } from "../IMessage";

export interface IAccountsListProps{
    accountsData: IAccount[];
    setAccountsMessage(message: IMessage): void;
}
