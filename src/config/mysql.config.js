import { Sequelize } from 'sequelize';
import { log } from 'debug';
import knex from "knex";
import config from "./knexfile.js";
import { up, down } from '../migrations/create_pokemon_tables.js'

async function runMigrations(arg) {
  const db = knex(config);
  try {
    if (arg == 'up') {
        await up(knex(config));
        log('MySQL: Migração realizada com Sucesso')
    }
    if (arg == 'down') {
        await down(knex(config));
    }
  } catch (error) {
    log('MySQL: Erro ao realizar a Migração: '+error)
    await db.migrate.rollback(config)
  } finally {
    await db.destroy();
  }
}

export const mysqlConfig = {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'mysql123',
    host: process.env.MYSQL_IP || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    database: 'pokemon',
    dialect: 'mysql',
    logging: false
};

export const sequelize = new Sequelize(mysqlConfig);

sequelize.authenticate()
    .then(() => {
        log('MySQL: Conectado com Sucesso')
        runMigrations(process.env.MIGRATION);
    })
    .catch((e) => log(`Erro ao se conectar com MySQL: ${e}`));