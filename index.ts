import express, { Request } from "express";

function subdomainhandler(sub: SubDomainRouter,request: any, response: any, next: any) {

    if(sub.is(request)) {
        const route = sub.routes.find(() => sub.isRoute(request));

        if(route) {
            route.handle(request, response, next);
        } else {
            if(sub.staticAssets) {
                sub.staticAssets(request, response, next);
            } else {
                next();
            }
        }
        
    } 

}


export default class SubDomainRouter {

    public subdomain: string
    public routes: Array<{path: string, method: string, handle: any}>
    public staticAssets: any
    private router: express.Router

    constructor(subdomain: string, app: express.Application) {
        this.subdomain = subdomain;
        this.routes = [];
        this.router = express.Router();

        if(!('express_routes_subdomain' in process)) {
            (process as any)['express_routes_subdomain'] = [];
        }

        
        this.router.use((req, res, next) =>{ 
            subdomainhandler( (process as any)['express_routes_subdomain'].find((r: SubDomainRouter) => r.is(req)), req, res, next)
        })
        app.use(this.router);
        

        (process as any)['express_routes_subdomain'].push(this);
       
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

    static(path: string) {
        this.staticAssets = express.static(path);

    }

    is(req: Request) {
        const { host } = req.headers;

        if(host) {
            const subdomain = host.substring(0, host.indexOf("."));

            return subdomain == this.subdomain;
        }

        return false;
    }

    isRoute(request: express.Request): boolean {
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
