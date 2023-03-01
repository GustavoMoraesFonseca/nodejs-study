import { expect, test, describe, beforeAll } from "@jest/globals";
import { UserRepository } from "../../src/repository/user.repository.js";

var repository;

const expectReturn = Promise.resolve({
  name: "Gustavo",
  password: "string1"
});

class UserModelMock {
  save(user) {return expectReturn}
  static find() {return [expectReturn]}
  static findById(id) {return expectReturn}
  static findByIdAndUpdate(id, user) {return 1}
  static findByIdAndDelete(id) {return 1}
  static findOne(user) {return expectReturn}  
}

beforeAll(() => {
  repository = new UserRepository();
  repository._model = UserModelMock;
});

describe("Create User", () => {
  test("When create User, Should return created User", () => {
    const dto = {
      name: "Gustavo",
      password: "string1"
    };

    const retorno = repository.create(dto);

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual(expectReturn);
  })
});

describe("Find All User", () => {
  test("When find all User, Should return all User", () => {
    const retorno = repository.findAll();

    expect(retorno).not.toBeNull;
    expect(retorno).toStrictEqual([expectReturn]);
  })
});

describe("Find By Id User", () => {
  test("When find by id User, Should return a User", () => {
    const retorno = repository.findById('63ff3d7904e604866b06b064');

    expect(retorno).not.toBeNull();
    expect(retorno).toStrictEqual(expectReturn);
  })
});

describe("Find User By Name and Password", () => {
  test("When call Find User By Name and Password, Should return a User", () => {
    const retorno = repository.findByNameAndPassword({});

    expect(retorno).not.toBeNull();
    expect(retorno).toStrictEqual(expectReturn);
  })
});

describe("Update User", () => {
  test("When update User, Should return 1", () => {
    const dto = {
      name: "Gustavo",
      password: "string1"
    };

    const retorno = repository.update(dto, '63ff3d7904e604866b06b064');

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(1);
  })
});

describe("Delete User", () => {
  test("When delete User, Should return 1", () => {
    const retorno = repository.delete('63ff3d7904e604866b06b064');

    expect(retorno).not.toBeNull;
    expect(retorno).toBe(1);
  })
});
