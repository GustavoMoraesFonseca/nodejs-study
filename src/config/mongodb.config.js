import { connect, mongoose } from 'mongoose';
import { log } from 'debug';

//mongodb://{user}:{senha}@{host}:{port}/{schema}
//mongodb://localhost:27017/db_finance
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_IP = process.env.MONGO_IP || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;

export const mongoConfig = connect(
    //`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/users`,
    `mongodb://${MONGO_IP}:${MONGO_PORT}/users`,
    () => {
        log('MongoDB: Conectado com Sucesso')
    }).catch(e => {
        log(`Erro ao se conectar com MongoDB: ${e}`);
    }
);

mongoose.Error.messages.general.required = "O atributo '{PATH}' não pode ser nulo";
mongoose.Error.messages.Number.min = "O '{VALUE}' informado é menor que o limite de '{MIN}'"
mongoose.Error.messages.Number.min = "O '{VALUE}' informado é maior que o limite de '{MAX}'"
