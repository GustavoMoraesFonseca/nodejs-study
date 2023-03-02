import { sequelize } from './config/mysql.config.js';
import { server } from './config/server.config.js';
import { mongoConn } from './config/mongodb.config.js';
import { channel } from './config/rabbitmq.config.js';
import { consumeFromQueue } from './consumer/consumer.js';
import { pokemonRoutesInitialize } from './factory/pokemon-routes.factory.js';
import { userRoutesInitialize } from './factory/user-routes.factory.js';
import { log } from 'debug';

userRoutesInitialize();
pokemonRoutesInitialize();

consumeFromQueue();

process.on('SIGTERM', () => {
    log('Server ending', new Date().toISOString());
    server.close(async () => {
        await sequelize.close();
        await mongoConn.close();
        await channel.close();
        process.exit();
    })
})