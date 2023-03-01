import {
  create,
  findAll,
  findById,
  update,
  deleteById,
} from "./common.controller.js";

var service;

export class PokemonController {
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
}
