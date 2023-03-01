import { jest, expect, test, describe, beforeAll, afterAll } from '@jest/globals';
import supertest from 'supertest';

import { app, server } from '../../src/config/server.config.js';
import { userRoutes, userController } from '../../src/routes/user.routes.js';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes.js';
import { UserService } from '../../src/service/user.service.js';
import { ErrorDto } from '../../src/dto/error.dto.js';
import { ErrorsConstants } from '../../src/constants/errors.constants.js';

jest.mock('../../src/service/user.service.js');

const expectReturn = {
  name: "Gustavo",
  password: "$2b$10$1SWkFpHrV7XPo3/K2TkjxuBLMf/0.50Sa4QNYNCmaAKCEtU6y4doG",
  _id: "63f8c573dacbd78663e16595",
  __v: 0
}

const expectTokenReturn = {name: 'Gustavo', token: '123'};

const expectServerError = [new ErrorDto(ErrorsConstants.SERVER_ERROR, 'Erro inesperado. Tente novamente mais tarde.')];

beforeAll(() => {
  userRoutes();
  userController._service = new UserService();
});

describe('Token', () => {
  beforeAll(() => {
    jest.spyOn(userController._service, 'findByNameAndPassword')
      .mockImplementationOnce(() => expectTokenReturn)
      .mockImplementation(() => {throw [expectServerError]});
  })

  test('When call Token, Should return OK', async () => {
    const requestBody = {name: 'Gustavo', password: 'string1'};
    
    const res = await supertest(app)
      .post('/login')
      .send(requestBody);

    expect(res.body.data).not.toBeNull();
    expect(res.body.data.name).toBe(requestBody.name);
    expect(res.body.data.token).not.toBeNull();
  });

  test('When call Token throws Error, Should throws an Error', async () => {
    const requestBody = {name: 'Gustavo', password: 'string1'};
    
    const res = await supertest(app)
      .post('/login')
      .send(requestBody);

    expect(res.body.data).toBeNull();
    expect(res.body.error).not.toBeNull();
  });
});

describe('Create User', () => {
  beforeAll(() => {
    jest.spyOn(userController._service, 'create')
      .mockImplementationOnce(() => expectReturn)
      .mockImplementationOnce(
        () => {
          throw [new ErrorDto(ErrorsConstants.REQUIRED_ERROR, 'O nome é obrigatório.')]
        }
      )
      .mockImplementationOnce(
        () => {
          throw [new ErrorDto(ErrorsConstants.UNIQUE_ERROR, 'Gustavo já existe.')]
        }
      )
      .mockImplementation(() => {throw [expectServerError]});
  })

  test('When create User, Should return OK', async () => {
    const requestBody = {
      name: 'Gustavo',
      password: 'string'
    }

    const res = await supertest(app)
      .post('/user')
      .send(requestBody);

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.data).toStrictEqual(expectReturn);
    expect(res.body.errors).toBeNull();
  });

  test('When create User with DexNumber null, Should return BadRequest', async () => {
    const requestBody = {
      name: 'Bulbasaur',
      dexNumber: null,
      mainTypeId: 3,
      secondTypeId: 9
    }

    const res = await supertest(app)
      .post('/user')
      .send(requestBody);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['O nome é obrigatório.']);
  });

  test('When create User that already exists, Should return Conflict', async () => {
    const requestBody = {
      name: 'Bulbasaur',
      dexNumber: 1,
      mainTypeId: 3,
      secondTypeId: 9
    }

    const res = await supertest(app)
      .post('/user')
      .send(requestBody);

    expect(res.statusCode).toBe(StatusCodes.CONFLICT);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Gustavo já existe.']);
  });

  test('When create User throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app)
      .post('/user')
      .send({});

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    ['']
  });
});

describe('Find All User', () => {
  beforeAll(() => {
    jest.spyOn(userController._service, 'findAll')
      .mockImplementationOnce(() => [expectReturn])
      .mockImplementationOnce(() => null)
      .mockImplementation(() => {throw [expectServerError]});
  })

  test('When call Find All Should return OK', async () => {
    const res = await supertest(app).get('/user');

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data).toStrictEqual([expectReturn]);
    expect(res.body.errors).toBeNull();
  });

  test('When call Find All and does not have user stored Should return NotFound', async () => {
    const res = await supertest(app).get('/user');

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBe('Registro não encontrado');
    expect(res.body.errors).toBeNull();
  });

  test('When Find All User throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app).get('/user');

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    ['']
  });
});

describe('Find User By Id', () => {
  beforeAll(() => {
    jest.spyOn(userController._service, 'findById')
      .mockImplementationOnce(() => expectReturn)
      .mockImplementationOnce(() => null)
      .mockImplementation(() => {throw [expectServerError]});
  })

  test('When call Find User By Id Should return OK', async () => {
    const res = await supertest(app).get('/user/'+1);
    
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.data).toStrictEqual(expectReturn);
    expect(res.body.errors).toBeNull();
  });

  test('When call Find By Id and does not have user stored Should return NotFound', async () => {
    const res = await supertest(app).get('/user/'+1);

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBe('Registro não encontrado');
    expect(res.body.errors).toBeNull();
  });

  test('When Find By Id User throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app).get('/user/'+1);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    ['']
  });
});

describe('Update User By Id', () => {
  beforeAll(() => {
    jest.spyOn(userController._service, 'update')
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => null)
      .mockImplementation(() => {throw [expectServerError]});
  })

  test('When call Update User Should return OK', async () => {
    const requestBody = {
      id: 1,
      name: 'Bulbasauro',
      dexNumber: 1,
      mainTypeId: 3,
      secondTypeId: 9
    }

    const res = await supertest(app)
      .put('/user/63f8c573dacbd78663e16591')
      .send(requestBody);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.data).toBe('Atualizado com sucesso');
    expect(res.body.errors).toBeNull();
  });

  test('When call Update and does not have user stored Should return NotFound', async () => {
    const res = await supertest(app).put('/user/63f8c573dacbd78663e16591');

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBe('Registro não encontrado');
    expect(res.body.errors).toBeNull();
  });

  test('When Update User throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app).put('/user/63f8c573dacbd78663e16591');

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
  });
});

describe('Delete User By Id', () => {
  beforeAll(() => {
    jest.spyOn(userController._service, 'delete')
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => null)
      .mockImplementation(() => {throw [expectServerError]});
  })

  test('When call Delete User Should return OK', async () => {
    const res = await supertest(app)
      .delete('/user/63f8c573dacbd78663e16591');

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.data).toBe('Excluído com sucesso');
    expect(res.body.errors).toBeNull();
  });

  test('When call Delete and does not have user stored Should return NotFound', async () => {
    const res = await supertest(app).delete('/user/63f8c573dacbd78663e16591');

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBe('Registro não encontrado');
    expect(res.body.errors).toBeNull();
  });

  test('When Delete User throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app).delete('/user/63f8c573dacbd78663e16591');

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
  });
});