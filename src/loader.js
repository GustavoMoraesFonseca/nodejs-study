import { mysqlConfig } from './config/mysql.config.js';
import { mongoConfig } from './config/mongodb.config.js';
import { server } from './config/server.config.js';
import { channel } from './config/rabbitmq.config.js';
import { log } from 'debug';
import { consumeFromQueue } from './consumer/consumer.js';
import { pokemonRoutesInitialize } from './factory/pokemon-routes.factory.js';
import { userRoutesInitialize } from './factory/user-routes.factory.js';

userRoutesInitialize();
pokemonRoutesInitialize();

consumeFromQueue()

process.on('SIGTERM', () => {
    log('Server ending', new Date().toISOString());
    server.close(async () => {
        await mongoConfig.close();
        await mysqlConfig.close();
        await channel.close();
        process.exit();
    })
})