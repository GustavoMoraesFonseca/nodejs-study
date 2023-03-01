import { expect, test, describe, beforeAll } from "@jest/globals";
import { PokemonRepository } from "../../src/repository/pokemon.repository.js";

var repository;

const expectCreateReturn = Promise.resolve({
  id: 1,
  name: "Bulbasaur",
  dex_number: 1,
  main_type_id: 3,
  second_type_id: 9,
  dthr_create: "2023-02-20 17:49:31",
  dthr_update: "2023-02-20 17:49:31",
});

const expectFindAllReturn = Promise.resolve([
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
]);

const expectFindByIdReturn = Promise.resolve([
    {
      id: 1,
      name: "Charmander",
      dex_number: 4,
      main_type: {
        name: "Fire",
      },
      second_type: null,
    }
])

beforeAll(() => {
  repository = new PokemonRepository();
  repository._schema = {
    create: () => expectCreateReturn,
    findAll: () => expectFindAllReturn,
    findByPk: () => expectFindByIdReturn,
    update: () => 1,
    destroy: () => 1
  };
  repository._relationSchema = {};
  repository._schema
  repository._relationSchema;
});

describe("Create Pokemon", () => {
  test("When create Pokemon, Should return created Pokemon", () => {
    const dto = {
      name: "Bulbasaur",
      dex_number: 1,
      main_type_id: 3,
      second_type_id: 9,
    };

    const retorno = repository.create(dto);

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectCreateReturn);
  })
});

describe("Find All Pokemon", () => {
  test("When find all Pokemon, Should return all Pokemon", () => {
    const retorno = repository.findAll();

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectFindAllReturn);
  })
});

describe("Find By Id Pokemon", () => {
  test("When find by id Pokemon, Should return a Pokemon", () => {
    const retorno = repository.findById(1);

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectFindByIdReturn);
  })
});

describe("Update Pokemon", () => {
  test("When update Pokemon, Should return 1", () => {
    const dto = {
      name: "Bulbasaur",
      dex_number: 1,
      main_type_id: 3,
      second_type_id: 9,
    };

    const retorno = repository.update(dto, 1);

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(1);
  })
});

describe("Delete Pokemon", () => {
  test("When delete Pokemon, Should return 1", () => {
    const retorno = repository.delete(1);

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(1);
  })
});
