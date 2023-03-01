import { JsonMiddleware } from '../middleware/json.middleware.js';
import { CorsMiddleware } from '../middleware/cors.middleware.js';
import { SwaggerMiddleware } from '../middleware/swagger.middleware.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import express from 'express';
import env from 'dotenv';

env.config({encoding: 'UTF-8'});

export const app = express();

new CorsMiddleware(app);
new JsonMiddleware(app);
new AuthMiddleware(app);
new SwaggerMiddleware(app);

export var server;

if (process.env.NODE_ENV !== 'test') {
    server = app.listen(process.env.PORT);
}