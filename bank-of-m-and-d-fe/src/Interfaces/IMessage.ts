export interface IMessage {
    status: MessageStatus;
    message: string;
}

export enum MessageStatus {
    success,
    error,
    accountDeleted
};
