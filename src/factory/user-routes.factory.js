import { UserService } from '../service/user.service.js';
import { UserRepository } from '../repository/user.repository.js';
import { UserModel } from '../models/user.model.js';
import { userRoutes, userController } from '../routes/user.routes.js';

export function userRoutesInitialize() {
    userController._service = new UserService();
    userController._service._repository = new UserRepository();
    userController._service._repository._model = UserModel;
    
    userRoutes();
}
