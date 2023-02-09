"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subdomain = exports.SubDomainRouter = void 0;
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var SubDomainRouter = /** @class */ (function () {
    function SubDomainRouter(subdomain, app) {
        Object.defineProperty(this, "staticAssets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "subdomain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "routes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "router", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: express_1.default.Router()
        });
        this.subdomain = subdomain;
        if (!('express_routes_subdomain' in process)) {
            process['express_routes_subdomain'] = [];
            app.use(SubDomainRouter.handle);
        }
        app.use(this.router);
        process['express_routes_subdomain'].push(this);
    }
    Object.defineProperty(SubDomainRouter, "handle", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (req, res, next) {
            var sub = process['express_routes_subdomain'].find(function (s) { return s.isSubdomain(req); });
            if (sub) {
                var route = sub.routes.find(function () { return sub.isRoute(req); });
                if (route) {
                    route.handle(req, res);
                }
                else if (sub.staticAssets != null) {
                    sub.staticAssets(req, res, next);
                }
                else {
                    res.write("Cannot ".concat(req.method, " ").concat(req.path));
                    res.end();
                }
                return;
            }
            next();
        }
    });
    Object.defineProperty(SubDomainRouter.prototype, "route", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (type, path, handle) {
            this.routes.push({
                path: path,
                method: type,
                handle: handle
            });
        }
    });
    Object.defineProperty(SubDomainRouter.prototype, "get", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (path, handle) {
            this.route("get", path, handle);
        }
    });
    Object.defineProperty(SubDomainRouter.prototype, "post", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (path, handle) {
            this.route("post", path, handle);
        }
    });
    Object.defineProperty(SubDomainRouter.prototype, "put", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (path, handle) {
            this.route("put", path, handle);
        }
    });
    Object.defineProperty(SubDomainRouter.prototype, "delete", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (path, handle) {
            this.route("delete", path, handle);
        }
    });
    Object.defineProperty(SubDomainRouter.prototype, "static", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (path) {
            this.staticAssets = express_1.default.static(path);
        }
    });
    Object.defineProperty(SubDomainRouter, "isUknownSubdomain", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (req) {
            return req.headers.host && req.headers.host.substring(0, req.headers.host.indexOf(".")) != "";
        }
    });
    Object.defineProperty(SubDomainRouter.prototype, "isSubdomain", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (req) {
            return req.headers.host && req.headers.host.substring(0, req.headers.host.indexOf(".")) === this.subdomain;
        }
    });
    Object.defineProperty(SubDomainRouter.prototype, "isRoute", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (request) {
            return this.routes.find(function (route) {
                var paths = route.path.split("/");
                var $paths = request.path.split("/");
                var builded_path = [];
                for (var i in paths) {
                    var name_1 = paths[i];
                    if (name_1.startsWith(":")) {
                        var value = $paths[i];
                        if (value != "") {
                            builded_path.push(paths[i]);
                            request.params[name_1.substring(1, name_1.length)] = value;
                        }
                    }
                    else {
                        builded_path.push($paths[i]);
                    }
                }
                return builded_path.join("/") == route.path && route.method == request.method.toLowerCase();
            }) != null;
        }
    });
    return SubDomainRouter;
}());
exports.SubDomainRouter = SubDomainRouter;
function subdomain(subdomain, app) {
    return new SubDomainRouter(subdomain, app);
}
exports.subdomain = subdomain;
//# sourceMappingURL=index.js.map