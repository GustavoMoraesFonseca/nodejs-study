import {
  create, findAll, findById, update, deleteById
} from "./common.controller.js";
import { exceptionHandler } from "../validation/exception-handler.js";
import jwt from "jsonwebtoken";
import { ResponseDto } from "../dto/response.dto.js";

var service;

export class UserController {
  get _service() {
    return service;
  }

  set _service(value) {
    service = value;
  }

  create(req, res) {
    create(service, req, res);
  }
  findAll(req, res) {
    findAll(service, req, res);
  }
  findById(req, res) {
    findById(service, req, res);
  }
  update(req, res) {
    update(service, req, res);
  }
  delete(req, res) {
    deleteById(service, req, res);
  }

  async token(req, res) {
    const { name, password } = req.body;
    try {
      const user = await service.findByNameAndPassword(name, password);
      return res.json(
        new ResponseDto(
          {
            name: user.name,
            token: getToken({ name: name, password: password }),
          },
          null
        )
      );
    } catch (error) {
      exceptionHandler(error, res);
    }
  }
}

function getToken(user) {
  return jwt.sign(user, process.env.PRIVATE_KEY, { expiresIn: 300 });
}
