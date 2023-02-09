import express, { Request, Response } from "express";



export class SubDomainRouter {

    private staticAssets: any
    private subdomain: string
    private readonly routes: Array<{path: string, method: string, handle: any}> = []
    private readonly router: express.Router =  express.Router();

    constructor(subdomain: string, app: express.Application) {
        this.subdomain = subdomain;

        if(!('express_routes_subdomain' in process)) {
            (process as any)['express_routes_subdomain'] = [];
            app.use(SubDomainRouter.handle);
        }
        
        
    

        app.use(this.router);
        

        (process as any)['express_routes_subdomain'].push(this);

       
    }

    private static handle(req: Request, res: Response, next: any) {
        const sub = ((process as any)['express_routes_subdomain'] as Array<SubDomainRouter>).find(s => s.isSubdomain(req));

        if(sub) {
            const route = sub.routes.find(() => sub.isRoute(req));
            if(route) {
                 route.handle(req, res);
            } else if(sub.staticAssets != null) {
                sub.staticAssets(req, res,next);
            }  else {
                res.write(`Cannot ${req.method} ${req.path}`);
                res.end();
            }

            return;
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


export function subdomain(subdomain: string, app: express.Application): SubDomainRouter {
    return new SubDomainRouter(subdomain, app)
}
