import { ErrorsConstants } from '../constants/errors.constants.js'
import { ErrorDto } from "../dto/error.dto.js";
import { UserDto } from "../dto/user.dto.js";
import bcrypt from 'bcrypt';

var repository;

export class UserService {
  get _repository() {
    return repository;
  }

  set _repository(value) {
    repository = value;
  }

  async create(dto) {
    const user = new UserDto(dto);
    try {
      if (user.password) {
        user.password = getEncodedPassword(user.password);
      }
      return await repository.create(user);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findAll() {
    try {
      const users = await repository.findAll();
      return users.length == 0? null : users;
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
    const user = new UserDto(dto);
    try {
      user.password = getEncodedPassword(user.password);
      return await repository.update(id, user);
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

  async findByNameAndPassword(name, password) {
    try {
      if (name && password) {
        const user = await repository.findByNameAndPassword({name});
        if (user != null && bcrypt.compareSync(password, user.password)) {
          return user;
        }
      }
      throw new ErrorDto(
        ErrorsConstants.REQUIRED_ERROR, 'Nome ou Senha inválidos.'
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
}

function getEncodedPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function invalidIdMessageHandler(error) {
  if (error.name == 'CastError') {
    return new ErrorDto(
      ErrorsConstants.REQUIRED_ERROR, 'Id inválido.'
    );
  }
  return error;
}

function notNullMessageHandler(error) {
  if (error && error.errors) {
    return new ErrorDto(
      ErrorsConstants.REQUIRED_ERROR, Object.values(error.errors).map(val => val.message)[0]
    );
  }
  return error;
}
  
function uniqueMessageHandler(error) {
  if (error.message && error.message.includes('duplicate key')) {
    return new ErrorDto(
      ErrorsConstants.UNIQUE_ERROR, `${error.keyValue.name} já existe.`
    );
  }
  return error;
}

function internalServerMessageHandler(error) {
  if (error) {  
    if (error.type == ErrorsConstants.REQUIRED_ERROR
      || error.type == ErrorsConstants.UNIQUE_ERROR) {
      return error;
    }  
  }
  return new ErrorDto(
    ErrorsConstants.SERVER_ERROR, 'Erro inesperado. Tente novamente mais tarde.'
  );
}

function errorHandler(error) {
  const validationErrors = [];
  if (error) {
    error = invalidIdMessageHandler(error)
    error = notNullMessageHandler(error);
    error = uniqueMessageHandler(error);
  }
  error = internalServerMessageHandler(error);
  validationErrors.push(error);
  return validationErrors;
}