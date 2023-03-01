import { Sequelize } from 'sequelize';
import { log } from 'debug';

export const mysqlConfig = new Sequelize(
    'pokemon',
    process.env.MYSQL_USER ?? 'master-trainer',
    process.env.MYSQL_PASSWORD ?? 'Poke@Mon151', 
    {
        host: process.env.MYSQL_IP ?? 'localhost',
        port: process.env.MYSQL_PORT ?? 3306,
        dialect: 'mysql',
        logging: false
    }
);

mysqlConfig.authenticate()
.then(() => {
    log('MySQL: Conectado com Sucesso')
}).catch((e) => {
    log(`Erro ao se conectar com MySQL: ${e}`);
});