import { jest, expect, test, describe, beforeAll } from '@jest/globals';
import supertest from 'supertest';

import jwt from 'jsonwebtoken';
import { app, server } from '../../src/config/server.config.js';
import { pokemonRoutes, pokemonController } from '../../src/routes/pokemon.routes';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes.js';
import { PokemonService } from '../../src/service/pokemon.service.js';
import { ErrorDto } from '../../src/dto/error.dto.js';
import { ErrorsConstants } from '../../src/constants/errors.constants.js';

jest.mock('../../src/service/pokemon.service.js');

var token;

const expectCreateReturn = {
  id: 1,
  name: 'Bulbasaur',
  dex_number: 1,
  main_type_id: 3,
  second_type_id: 9,
  dthr_create: '2023-02-20 17:49:31',
  dthr_update: '2023-02-20 17:49:31'
}

const expectFindReturn = [
  {
    id: 1,
    name: 'Charmander',
    dex_number: 4,
    main_type: {
      name: 'Fire',
    },
    second_type: null
  },
  {
    id: 2,
    name: 'Charmeleon',
    dex_number: 5,
    main_type: {
      name: 'Fire',
    },
    second_type: null
  },
  {
    id: 3,
    name: 'Charizard',
    dex_number: 6,
    main_type: {
      name: 'Fire',
    },
    second_type: {
      name: 'Flying'
    }
  }
];

const expectServerError = [new ErrorDto(ErrorsConstants.SERVER_ERROR, 'Erro inesperado. Tente novamente mais tarde.')];
const expectRequiredError = [new ErrorDto(ErrorsConstants.REQUIRED_ERROR, 'Dex_number deve ser informado.')];
const expectUniqueError = [new ErrorDto(ErrorsConstants.UNIQUE_ERROR, 'Dex_number com 1 já está cadastrado.')];

beforeAll(() => {
  pokemonRoutes();
  pokemonController._service = new PokemonService();
});

beforeEach(() => {
  token = jwt.sign({}, process.env.PRIVATE_KEY, { expiresIn: 4 });
})


describe('Create Pokemon', () => {
  beforeAll(() => {
    jest.spyOn(pokemonController._service, 'create')
      .mockImplementationOnce(() => expectCreateReturn)
      .mockImplementationOnce(() => {throw expectRequiredError})
      .mockImplementationOnce(() => {throw expectUniqueError})
      .mockImplementationOnce(() => {throw expectServerError})
      .mockImplementation(() => {});
  })

  test('When create Pokemon, Should return OK', async () => {
    const requestBody = {
      name: 'Bulbasaur',
      dexNumber: 1,
      mainTypeId: 3,
      secondTypeId: 9
    }

    const res = await supertest(app)
      .post('/pokemon')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody);

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.data).toMatchObject(expectCreateReturn);
    expect(res.body.errors).toBeNull();
  });

  test('When create Pokemon with DexNumber null, Should return BadRequest', async () => {
    const requestBody = {
      name: 'Bulbasaur',
      dexNumber: null,
      mainTypeId: 3,
      secondTypeId: 9
    }

    const res = await supertest(app)
      .post('/pokemon')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Dex_number deve ser informado.']);
  });

  test('When create Pokemon that already exists, Should return Conflict', async () => {
    const requestBody = {
      name: 'Bulbasaur',
      dexNumber: 1,
      mainTypeId: 3,
      secondTypeId: 9
    }

    const res = await supertest(app)
      .post('/pokemon')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody);

    expect(res.statusCode).toBe(StatusCodes.CONFLICT);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Dex_number com 1 já está cadastrado.']);
  });

  test('When create Pokemon throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app)
      .post('/pokemon')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Erro inesperado. Tente novamente mais tarde.']);
  });

  test('When create Pokemon without a Token, Should return Unauthorized', async () => {
    const res = await supertest(app)
      .post('/pokemon')
      .send({});

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Token deve ser informado']);
  });

  test('When create Pokemon invalid a Token, Should return Forbidden', async () => {
    const res = await supertest(app)
      .post('/pokemon')
      .set('Authorization', `Bearer token`)
      .send({});

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Token inválido']);
  });

  test('When create Pokemon expired Token, Should return Forbidden', async () => {
    const res = await supertest(app)
      .post('/pokemon')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Nzc2MTYwODgsImV4cCI6MTY3NzYxNjA5Mn0.5r7zZ2ApbeKrmTFxUNkMYVfmV-cNC4CTxrOuI8fRrCQ`)
      .send({});

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN); 
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Token expirado']);
  });
});

describe('Find All Pokemon', () => {
  beforeAll(() => {
    jest.spyOn(pokemonController._service, 'findAll')
      .mockImplementationOnce(() => expectFindReturn)
      .mockImplementationOnce(() => null)
      .mockImplementation(() => {throw expectServerError});
  })

  test('When call Find All Should return OK', async () => {
    const res = await supertest(app)
    .get('/pokemon')
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.length).toBe(3);
    expect(res.body.data[0]).toMatchObject(expectFindReturn[0]);
    expect(res.body.data[1]).toMatchObject(expectFindReturn[1]);
    expect(res.body.data[2]).toMatchObject(expectFindReturn[2]);
    expect(res.body.errors).toBeNull();
  });

  test('When call Find All and does not have pokemon stored Should return NotFound', async () => {
    const res = await supertest(app)
    .get('/pokemon')
    .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBe('Registro não encontrado');
    expect(res.body.errors).toBeNull();
  });

  test('When Find All Pokemon throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app)
    .get('/pokemon')
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Erro inesperado. Tente novamente mais tarde.']);
  });
});

describe('Find Pokemon By Id', () => {
  beforeAll(() => {
    jest.spyOn(pokemonController._service, 'findById')
      .mockImplementationOnce(() => expectFindReturn[0])
      .mockImplementationOnce(() => null)
      .mockImplementation(() => {throw expectServerError});
  })
  
  test('When call Find Pokemon By Id Should return OK', async () => {
    const res = await supertest(app)
    .get('/pokemon/'+1)
    .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.data).toMatchObject(expectFindReturn[0]);
    expect(res.body.errors).toBeNull();
  });

  test('When call Find By Id and does not have pokemon stored Should return NotFound', async () => {
    const res = await supertest(app)
    .get('/pokemon/'+1)
    .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBe('Registro não encontrado');
    expect(res.body.errors).toBeNull();
  });

  test('When Find By Id Pokemon throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app)
    .get('/pokemon/'+1)
    .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Erro inesperado. Tente novamente mais tarde.']);
  });
});

describe('Update Pokemon By Id', () => {
  beforeAll(() => {
    jest.spyOn(pokemonController._service, 'update')
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => null)
      .mockImplementation(() => {throw expectServerError});
  })

  test('When call Update Pokemon Should return OK', async () => {
    const requestBody = {
      id: 1,
      name: 'Bulbasauro',
      dexNumber: 1,
      mainTypeId: 3,
      secondTypeId: 9
    }

    const res = await supertest(app)
      .put('/pokemon/'+1)
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.data).toBe('Atualizado com sucesso');
    expect(res.body.errors).toBeNull();
  });

  test('When call Update and does not have pokemon stored Should return NotFound', async () => {
    const res = await supertest(app)
    .put('/pokemon/'+1)
    .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBe('Registro não encontrado');
    expect(res.body.errors).toBeNull();
  });

  test('When Update Pokemon throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app)
    .put('/pokemon/'+1)
    .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Erro inesperado. Tente novamente mais tarde.']);
  });
});

describe('Delete Pokemon By Id', () => {
  beforeAll(() => {
    jest.spyOn(pokemonController._service, 'delete')
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => null)
      .mockImplementation(() => {throw expectServerError});
  })

  test('When call Delete Pokemon Should return OK', async () => {
    const res = await supertest(app)
    .delete('/pokemon/'+1)
    .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.data).toBe('Excluído com sucesso');
    expect(res.body.errors).toBeNull();
  });

  test('When call Delete and does not have pokemon stored Should return NotFound', async () => {
    const res = await supertest(app)
      .delete('/pokemon/'+1)
      .set('Authorization', `Bearer ${token}`)
      
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBe('Registro não encontrado');
    expect(res.body.errors).toBeNull();
  });

  test('When Delete Pokemon throws an Error, Should return InternalServerError', async () => {
    const res = await supertest(app)
      .delete('/pokemon/'+1)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data).toBeNull();
    expect(res.body.errors).not.toBeNull();
    expect(res.body.errors).toStrictEqual(['Erro inesperado. Tente novamente mais tarde.'])
  });
});