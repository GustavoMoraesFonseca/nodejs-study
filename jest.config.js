export default {
    //Parar no Primeiro Erro
    bail: true,
    clearMocks: false,
    collectCoverage: true,
    collectCoverageFrom: ['src/**'],
    coveragePathIgnorePatterns: [
        'node_modules',
        'src/loader.js',
        'src/models/pokemon.model.js',
        'src/models/pokemon-type.model.js',
        'src/models/user.model.js',
        'src/middleware/swagger.middleware.js',
        'src/config/swagger.config.js',
        'src/config/mysql.config.js',
        'src/config/mongodb.config.js',
        'src/client/client.js',
        'src/producer/producer.js',
        'src/consumer/consumer.js',
        'src/factory/pokemon-routes.factory',
        'src/factory/user-routes.factory'
    ],
    coverageDirectory: 'tests/_coverage',
    testEnvironment: 'jest-environment-node',
    transform: {},
    testMatch: ['**/tests/**/**.**.test.js?(x)']
};