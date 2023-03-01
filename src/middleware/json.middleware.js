import bodyParser from 'body-parser';

export class JsonMiddleware {
    constructor(app) {
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
    }
}