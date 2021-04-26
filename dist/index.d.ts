export declare class RadioServer {
    static readonly PORT: number;
    private app;
    private httpServer;
    private httpsServer;
    private port;
    private path;
    constructor();
    private selfSign;
    private register;
    private listen;
}
