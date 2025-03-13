export interface TcpSocketConnectOpts extends ConnectOpts {
    port: number;
    host?: string | undefined;
    localAddress?: string | undefined;
    localPort?: number | undefined;
    hints?: number | undefined;
    family?: number | undefined;
    lookup?: LookupFunction | undefined;
    noDelay?: boolean | undefined;
    keepAlive?: boolean | undefined;
    keepAliveInitialDelay?: number | undefined;
    /**
     * @since v18.13.0
     */
    autoSelectFamily?: boolean | undefined;
    /**
     * @since v18.13.0
     */
    autoSelectFamilyAttemptTimeout?: number | undefined;
}

export interface IpcSocketConnectOpts extends ConnectOpts {
    path: string;
}

export type SocketConnectOpts = TcpSocketConnectOpts | IpcSocketConnectOpts;