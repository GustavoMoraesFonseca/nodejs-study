export default {
    //Parar no Primeiro Erro
    bail: true,
    clearMocks: false,
    collectCoverage: true,
    collectCoverageFrom: ['src/**'],
    coveragePathIgnorePatterns: [
        '../loader.js',
        '../models/pokemon.model.js',
        '../models/pokemon-type.model.js',
        '../models/user.model.js',
        '../middleware/swagger.middleware.js',
        '../config/swagger.config.js',
        '../config/mysql.config.js',
        '../config/mongodb.config.js',
        '../client/client.js',
        '../producer/producer.js',
        '../consumer/consumer.js',
        '../factory/pokemon-routes.factory',
        '../factory/user-routes.factory'
    ],
    coverageDirectory: '../tests/_coverage',
    testEnvironment: 'jest-environment-node',
    transform: {},
    testMatch: ['**/tests/**/**.**.test.js?(x)']
};