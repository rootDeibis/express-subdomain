import express, { Request } from "express";
export declare class SubDomainRouter {
    private staticAssets;
    private subdomain;
    private readonly routes;
    private readonly router;
    constructor(subdomain: string, app: express.Application);
    private static handle;
    private route;
    get(path: string, handle: (request: express.Request, respose: express.Response) => void): void;
    post(path: string, handle: (request: express.Request, respose: express.Response) => void): void;
    put(path: string, handle: (request: express.Request, respose: express.Response) => void): void;
    delete(path: string, handle: (request: express.Request, respose: express.Response) => void): void;
    static(path: string): void;
    static isUknownSubdomain(req: Request): boolean | "" | undefined;
    private isSubdomain;
    private isRoute;
}
export declare function subdomain(subdomain: string, app: express.Application): SubDomainRouter;
//# sourceMappingURL=index.d.ts.map