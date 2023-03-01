export class CorsMiddleware {

    constructor(app) {
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin','*');
            res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept');
            res.setHeader('Access-Control-Allow-Methods','PUT,GET,POST,DELETE,OPTIONS');
            next();
        });
    }
}