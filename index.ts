import express, { Request, Response } from "express";

if(!('express_routes_subdomain' in process)) {
    (process as any)['express_routes_subdomain'] = [];
}


export default class SubDomainRouter {

    private subdomain: string
    private routes: Array<{path: string, method: string, handle: any}>
    private staticAssets: any
    private router: express.Router

    constructor(subdomain: string, app: express.Application) {
        this.subdomain = subdomain;
        this.routes = [];
        this.router = express.Router();

        
        this.router.use((req, res, next) => this.handle(req, res, next));
        app.use(this.router);
        

        (process as any)['express_routes_subdomain'].push(this);
       
    }

    private handle(req: Request, res: Response, next: any) {
        if(this.isSubdomain(req)) {
            const route = this.routes.find(() => this.isRoute(req));
            if(route) {
                route.handle(req, res)
            } else {
                if(this.staticAssets) {
                    this.staticAssets(req, res, next);
                } 

               
            }
        } else if(SubDomainRouter.isUknownSubdomain(req)) {
            
        }

        next();
    }


    private route(type: "get" | "post" | "delete" | "put", path: string , handle: any) {
        this.routes.push({
            path,
            method: type,
            handle
        });
    }

    get(path: string, handle: (request: express.Request, respose: express.Response) => void) {
        this.route("get", path, handle);
    }

    post(path: string,handle: (request: express.Request, respose: express.Response) => void) {
        this.route("post", path, handle);
    }

    put(path: string,handle: (request: express.Request, respose: express.Response) => void) {
        this.route("put", path, handle);
    }

    delete(path: string,handle: (request: express.Request, respose: express.Response) => void) {
        this.route("delete", path, handle);
    }

    static(path: string) {
        this.staticAssets = express.static(path);

    }

    public static isUknownSubdomain(req: Request) {
        return req.headers.host && req.headers.host.substring(0, req.headers.host.indexOf(".")) != "";
    }

    private isSubdomain(req: Request) {
        return req.headers.host && req.headers.host.substring(0, req.headers.host.indexOf(".")) === this.subdomain;
    }

    private isRoute(request: express.Request): boolean {
        return this.routes.find(route => {
            const paths = route.path.split("/");
            const $paths = request.path.split("/");

            const builded_path: any[] = [];

            for(let i in paths) {
                const name: any = paths[i];
                if(name.startsWith(":")) {
                    
                    const value = $paths[i];

                    if(value != "") {
                        builded_path.push(paths[i]);
                        (request as any).params[name.substring(1, name.length)] = value;
                    } 

                } else {
                    builded_path.push($paths[i]);
                }

                

                
            }

            return builded_path.join("/") == route.path && route.method == request.method.toLowerCase();


       }) != null
    }

}
