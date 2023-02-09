# express-subdomain
A script that allows using subdomains in express.js


### Example
```js
import subdomain from "express-subdomains-middleware";
import express from 'express';

const app = express();


const FrontEndRouter = subdomain("www",app);
const BackEndRouter = subdomain("api", app);


FrontEndRouter.static("./static");

BackEndRouter.get("/example", (req, res) => {
    res.json({
        text: 'This is a backend path'
    })
})

app.listen(3000);
