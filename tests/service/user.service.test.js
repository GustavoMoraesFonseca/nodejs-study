import { jest, expect, test, describe, beforeAll } from "@jest/globals";
import { UserRepository } from "../../src/repository/user.repository.js";
import { UserService } from "../../src/service/user.service.js";
import { UserDto } from "../../src/dto/user.dto.js";
import { ErrorDto } from "../../src/dto/error.dto.js";
import { ErrorsConstants } from "../../src/constants/errors.constants.js";

jest.mock("../../src/repository/user.repository.js");

var service;

const expectReturn = {
  name: "Gustavo",
  password: "$2b$10$1SWkFpHrV7XPo3/K2TkjxuBLMf/0.50Sa4QNYNCmaAKCEtU6y4doG",
  _id: "63f8c573dacbd78663e16595",
  __v: 0,
};

const expectDefaultError = [
  new ErrorDto(
    ErrorsConstants.SERVER_ERROR,
    "Erro inesperado. Tente novamente mais tarde."
  ),
];

const expectNotNullError = [
  new ErrorDto(ErrorsConstants.REQUIRED_ERROR, "Name deve ser informado."),
];

const expectUniqueError = [
  new ErrorDto(ErrorsConstants.UNIQUE_ERROR, "Gustavo já existe."),
];

beforeAll(() => {
  service = new UserService();
  service._repository = new UserRepository();
});

describe("Create User", () => {
  beforeAll(() => {
    jest
      .spyOn(service._repository, "create")
      .mockImplementationOnce(() => expectReturn)
      .mockImplementationOnce(() => {
        throw { errors: { name: { message: "Name deve ser informado." } } };
      })
      .mockImplementationOnce(() => {
        throw { message: "duplicate key error", keyValue: { name: "Gustavo" } };
      });
  });

  test("When create User, Should return created User", async () => {
    const dto = new UserDto({
      name: "Gustavo",
      password: "string1",
    });

    const retorno = await service.create(dto);

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectReturn);
  });

  test("When create User that not informed, Should throws Error", async () => {
    await expect(() => service.create({})).rejects.toStrictEqual(
      expectNotNullError
    );
  });

  test("When create User that already exists, Should throws Error", async () => {
    await expect(() => service.create({})).rejects.toStrictEqual(
      expectUniqueError
    );
  });
});

describe("Find All User", () => {
  beforeAll(() => {
    jest
      .spyOn(service._repository, "findAll")
      .mockImplementationOnce(() => expectReturn)
      .mockImplementationOnce(() => {throw undefined})
      .mockImplementation(() => []);
  });

  test("When find all User, Should return all User", async () => {
    const retorno = await service.findAll();

    expect(retorno).not.toBeNull();
    expect(retorno).toStrictEqual(expectReturn);
  });

  test("When find all User throws an Error, Should throws Error", async () => {
    await expect(() => service.findAll()).rejects.toStrictEqual(
      expectDefaultError
    );
  });

  test("When find all User is empty, Should return null", async () => {
    const retorno = await service.findAll();

    expect(retorno).toBeNull();
  });
});

describe("Find By Id User", () => {
  beforeAll(() => {
    jest
      .spyOn(service._repository, "findById")
      .mockImplementationOnce(() => expectReturn[0])
      .mockImplementationOnce(() => {
        throw undefined;
      })
      .mockImplementation(() => {
        throw { name: "CastError" };
      });
  });

  test("When find by id User, Should return a User", async () => {
    const retorno = await service.findById(1);

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectReturn[0]);
  });

  test("When find by id User throws an Error, Should throws Error", async () => {
    await expect(() => service.findById(1)).rejects.toStrictEqual([
      new ErrorDto(
        ErrorsConstants.SERVER_ERROR,
        "Erro inesperado. Tente novamente mais tarde."
      ),
    ]);
  });

  test("When find by id with wrong id patter, Should throws Error", async () => {
    await expect(() => service.findById("teste")).rejects.toStrictEqual([
      new ErrorDto(ErrorsConstants.REQUIRED_ERROR, "Id inválido."),
    ]);
  });
});

describe("Update User", () => {
  beforeAll(() => {
    jest
      .spyOn(service._repository, "update")
      .mockImplementationOnce(() => 1)
      .mockImplementation(() => {
        throw undefined;
      });
  });

  test("When update User, Should return 1", async () => {
    const dto = new UserDto({
      name: "Gustavo",
      password: "string1",
    });

    const retorno = await service.update(dto, 1);

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(1);
  });

  test("When update User throws an Error, Should throws Error", async () => {
    await expect(() => service.update({}, 1)).rejects.toStrictEqual(
      expectDefaultError
    );
  });
});

describe("Delete User", () => {
  beforeAll(() => {
    jest
      .spyOn(service._repository, "delete")
      .mockImplementationOnce(() => 1)
      .mockImplementation(() => {
        throw new ErrorDto(ErrorsConstants.SERVER_ERROR, "");
      });
  });

  test("When delete User, Should return 1", async () => {
    const retorno = await service.delete(1);

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(1);
  });

  test("When delete User throws an Error, Should throws Error", async () => {
    await expect(() => service.delete(1)).rejects.toStrictEqual(
      expectDefaultError
    );
  });
});
describe("Find User By Name and Password", () => {
  const expectReturn = {name: 'Gustavo', password: '$2b$10$rkOiVISAb/J9JpWNYj0J9OxatfC797NzhUdJ14VsbZFv4tzaYrPUG'};
  beforeAll(() => {
    jest
      .spyOn(service._repository, "findByNameAndPassword")
      .mockImplementationOnce(() => expectReturn)
      .mockImplementation(() => null)
  });

  test("When call Find User by Id and Name, Should return User", async () => {
    const retorno = await service.findByNameAndPassword('Gustavo', 'string1');

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(expectReturn);
  });

  test("When call Find User by Id and Name and return null, Should throws Error", async () => {
    await expect(() => service.findByNameAndPassword('','')).rejects.toStrictEqual(
      [new ErrorDto(ErrorsConstants.REQUIRED_ERROR, "Nome ou Senha inválidos.")]
    );
  });
});
