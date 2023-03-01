import { jest, expect, test, describe, beforeAll } from "@jest/globals";
import { PokemonRepository } from "../../src/repository/pokemon.repository.js";
import { PokemonService } from "../../src/service/pokemon.service.js";
import { PokemonDto } from "../../src/dto/pokemon.dto.js";
import { ErrorDto } from "../../src/dto/error.dto.js";
import { ErrorsConstants } from '../../src/constants/errors.constants.js'

jest.mock("../../src/repository/pokemon.repository.js");

var service;

const expectCreateReturn = {
  id: 1,
  name: "Bulbasaur",
  dex_number: 1,
  main_type_id: 3,
  second_type_id: 9,
  dthr_create: "2023-02-20 17:49:31",
  dthr_update: "2023-02-20 17:49:31",
};

const expectFindReturn = [
  {
    id: 1,
    name: "Charmander",
    dex_number: 4,
    main_type: {
      name: "Fire",
    },
    second_type: null,
  },
  {
    id: 2,
    name: "Charmeleon",
    dex_number: 5,
    main_type: {
      name: "Fire",
    },
    second_type: null,
  },
  {
    id: 3,
    name: "Charizard",
    dex_number: 6,
    main_type: {
      name: "Fire",
    },
    second_type: {
      name: "Flying",
    },
  },
];

const expectDefaultError = [new ErrorDto(
  ErrorsConstants.SERVER_ERROR, 'Erro inesperado. Tente novamente mais tarde.'
)];

const expectTypeNotExistsError = [new ErrorDto(
  ErrorsConstants.REQUIRED_ERROR, 'Não registrado tipo: Charmander.'
)];

const expectNotNullError = [new ErrorDto(
  ErrorsConstants.REQUIRED_ERROR, 'Name deve ser informado.'
)];

const expectUniqueError = [new ErrorDto(
  ErrorsConstants.UNIQUE_ERROR, 'Name com Charmander já está cadastrado.'
)];

beforeAll(() => {
  service = new PokemonService();
  service._repository = new PokemonRepository();
});

describe("Create Pokemon", () => {
  beforeAll(() => {
    jest.spyOn(service._repository, "create")
      .mockImplementationOnce(() => expectCreateReturn)
      .mockImplementationOnce(() => {
        throw {name: 'SequelizeForeignKeyConstraintError', value: 'Charmander'};
      })
      .mockImplementationOnce(() => {
        throw {errors: [{type: 'Errors notNull', path: 'name'}]};
      })
      .mockImplementationOnce(() => {
        throw {errors: [{type: 'Error unique', path: 'name', value: 'Charmander'}]};
      });
  })

  test("When create Pokemon, Should return created Pokemon", async () => {
    const dto = new PokemonDto({
      name: "Bulbasaur",
      dex_number: 1,
      main_type_id: 3,
      second_type_id: 9,
    });

    const retorno = await service.create(dto);

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectCreateReturn);
  });

  test("When create Pokemon with Type that not exists, Should throws Error", async () => {
    await expect(() => service.create({})).rejects.toStrictEqual(expectTypeNotExistsError);
  });

  test("When create Pokemon that not informed, Should throws Error", async () => {
    await expect(() => service.create({})).rejects.toStrictEqual(expectNotNullError);
  });

  test("When create Pokemon that already exists, Should throws Error", async () => {
    await expect(() => service.create({})).rejects.toStrictEqual(expectUniqueError);
  });
});

describe("Find All Pokemon", () => {
  beforeAll(() => {
    jest.spyOn(service._repository, "findAll")
      .mockImplementationOnce(() => expectFindReturn)
      .mockImplementation(() => {
        throw undefined;
      });
  })

  test("When find all Pokemon, Should return all Pokemon", async () => {
    const retorno = await service.findAll();

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectFindReturn);
  });

  test("When find all Pokemon throws an Error, Should throws Error", async () => {
    await expect(() => service.findAll()).rejects.toStrictEqual(expectDefaultError);
  });
});

describe("Find By Id Pokemon", () => {
  beforeAll(() => {
      jest.spyOn(service._repository, "findById")
      .mockImplementationOnce(() => expectFindReturn[0])
      .mockImplementation(() => {throw {}});
  })

  test("When find by id Pokemon, Should return a Pokemon", async () => {
    const retorno = await service.findById(1);

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectFindReturn[0]);
  });

  test("When find by id Pokemon throws an Error, Should throws Error", async () => {
    await expect(() => service.findById(1)).rejects.toStrictEqual([{}]);
  });
});

describe("Update Pokemon", () => {
  beforeAll(() => {
    jest.spyOn(service._repository, "update")
      .mockImplementationOnce(() => 1)
      .mockImplementation(() => {throw undefined});
  })

  test("When update Pokemon, Should return 1", async () => {
    const dto = new PokemonDto({
      name: "Bulbasaur",
      dex_number: 1,
      main_type_id: 3,
      second_type_id: 9,
    });

    const retorno = await service.update(dto, 1);

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(1);
  });

  test("When update Pokemon throws an Error, Should throws Error", async () => {
    await expect(() => service.update({}, 1)).rejects.toStrictEqual(expectDefaultError);
  });
});

describe("Delete Pokemon", () => {
  beforeAll(() => {
    jest.spyOn(service._repository, "delete")
      .mockImplementationOnce(() => 1)
      .mockImplementation(() => {throw undefined;});
  })

  test("When delete Pokemon, Should return 1", async () => {
    const retorno = await service.delete(1);

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(1);
  });

  test("When delete Pokemon throws an Error, Should throws Error", async() => {
    await expect(() => service.delete(1)).rejects.toStrictEqual(expectDefaultError);
  });
});
