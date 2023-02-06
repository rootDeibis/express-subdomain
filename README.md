# express-subdomain
A script that allows using subdomains in express.js


### Example
```js
import SubDomainRouter from "./index";
import express from 'express';

const app = express();


const FrontEndRouter = new SubDomainRouter("www",app);
const BackEndRouter = new SubDomainRouter("api", app);


FrontEndRouter.static("./static");

BackEndRouter.get("/example", (req, res) => {
    res.json({
        text: 'This is a backend path'
    })
})

app.listen(3000);```
