import { ErrorsConstants } from "../constants/errors.constants.js";
import { CommonUtils } from "../common/common.utils.js";
import { PokemonDto } from "../dto/pokemon.dto.js";
import { ErrorDto } from "../dto/error.dto.js";
import { publishInQueue } from "../producer/producer.js";

var repository;

export class PokemonService {
  get _repository() {
    return repository;
  }

  set _repository(value) {
    repository = value;
  }

  async create(dto) {
    const pokemon = new PokemonDto(dto);
    try {
      publishInQueue(pokemon);
      return await repository.create(pokemon);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findAll() {
    try {
      return await repository.findAll();
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findById(id) {
    try {
      return await repository.findById(id);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(dto, id) {
    const pokemon = new PokemonDto(dto);
    try {
      pokemon.id = id;
      return await repository.update(pokemon);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async delete(id) {
    try {
      return await repository.delete(id);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}

function foreignKeyConstraintMessageHandler(error) {
  if (error.name == 'SequelizeForeignKeyConstraintError') {
    const msg = `Não registrado tipo: ${error.value}.`;
    return new ErrorDto(ErrorsConstants.REQUIRED_ERROR, msg);
  }
  return error;
}

function notNullMessageHandler(error) {
  if (error.type.includes('notNull')) {
    const msg = `${error.path} deve ser informado.`;
    return new ErrorDto(
      ErrorsConstants.REQUIRED_ERROR, CommonUtils.getStringWithFirstLetterUpperCase(msg)
    );
  }
  return error;
}

function uniqueMessageHandler(error) {
  if (error.type.includes('unique')) {
    const msg = `${error.path.replace('_UNIQUE', '')} com ${error.value} já está cadastrado.`;
    return new ErrorDto(
      ErrorsConstants.UNIQUE_ERROR, CommonUtils.getStringWithFirstLetterUpperCase(msg)
    );
  }
  return error;
}

function errorHandler(error) {
  const validationErrors = [];
  if (!!error) {
    if (!!error.errors) {
      error.errors.forEach((e) => {
        e = notNullMessageHandler(e);
        e = uniqueMessageHandler(e);
        validationErrors.push(e);
      });
    } else {
      error = foreignKeyConstraintMessageHandler(error);
      validationErrors.push(error);
    }
  } else {
    validationErrors.push(
      new ErrorDto(ErrorsConstants.SERVER_ERROR, 'Erro inesperado. Tente novamente mais tarde.')
    );
  }
  return validationErrors;
}