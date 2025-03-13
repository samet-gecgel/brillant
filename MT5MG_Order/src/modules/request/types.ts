export type IRequest = {
    RequestId: number;
    User: string;
    Command: string;
    Data: object;

    toJSON?: () => object;
}