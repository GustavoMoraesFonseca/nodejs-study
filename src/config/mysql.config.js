import { Sequelize } from 'sequelize';
import { log } from 'debug';

const mysqlConfig = {
    username: process.env.MYSQL_USER || 'master-trainer',
    password: process.env.MYSQL_PASSWORD || 'Poke@Mon151',
    host: process.env.MYSQL_IP || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    database: 'pokemon',
    dialect: 'mysql',
    logging: false
};

export const sequelize = new Sequelize(mysqlConfig);

sequelize.authenticate()
    .then(() => log('MySQL: Conectado com Sucesso'))
    .catch((e) => log(`Erro ao se conectar com MySQL: ${e}`));