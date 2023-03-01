import { UserController } from '../controller/user.controller.js'
import { app } from '../config/server.config.js';

export const userController = new UserController();

export function userRoutes() {
    app.post('/login', userController.token);
    
    app.post('/user', userController.create);
    app.get('/user', userController.findAll);
    app.get('/user/:id', userController.findById);
    app.put('/user/:id', userController.update);
    app.delete('/user/:id', userController.delete);
}
