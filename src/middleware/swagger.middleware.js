import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../swagger-output.json' assert { type: 'json' };

export class SwaggerMiddleware {
    constructor(app) {
        app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    }
}