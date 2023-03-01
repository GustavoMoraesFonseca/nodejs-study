import { StatusCodes } from "http-status-codes";
import { ResponseDto } from "../dto/response.dto.js";
import {
  exceptionHandler,
  responseMessageHandler
} from "../validation/exception-handler.js";

async function create(service, req, res) {
  const dto = req.body;
  try {
    res
      .status(StatusCodes.CREATED)
      .json(new ResponseDto(await service.create(dto), null));
  } catch (error) {
    exceptionHandler(error, res);
  }
}

async function findAll(service, req, res) {
  try {
    const data = await service.findAll();
    const response = responseMessageHandler(data, data);
    res.status(response.status).json(response.body);
  } catch (error) {
    exceptionHandler(error, res);
  }
}

async function findById(service, req, res) {
  const id = req.params.id;
  try {
    const data = await service.findById(id);
    const response = responseMessageHandler(data, data);
    res.status(response.status).json(response.body);
  } catch (error) {
    exceptionHandler(error, res);
  }
}

async function update(service, req, res) {
  const dto = req.body;
  const id = req.params.id;
  try {
    const data = await service.update(dto, id);
    const response = responseMessageHandler(
      data,
      "Atualizado com sucesso"
    );
    res.status(response.status).json(response.body);
  } catch (error) {
    exceptionHandler(error, res);
  }
}

async function deleteById(service, req, res) {
  const id = req.params.id;
  try {
    const data = await service.delete(id);
    const response = responseMessageHandler(
      data,
      "Excluído com sucesso"
    );
    res.status(response.status).json(response.body);
  } catch (error) {
    exceptionHandler(error, res);
  }
}

export {
  create,
  findAll,
  findById,
  update,
  deleteById
}