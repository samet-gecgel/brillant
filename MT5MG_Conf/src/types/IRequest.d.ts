export type IRequest = {
    RequestId: number;
    ReqUser: string;
    RetCode: string;
    RetCodeMessage: string;
    Data: {};

    toJson?: () => object;
};

