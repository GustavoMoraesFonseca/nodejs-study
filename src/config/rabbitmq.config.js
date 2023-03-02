import { connect } from 'amqplib';
import { log } from 'debug';
import env from 'dotenv';

env.config({encoding: 'UTF-8'});

export const QUEUE_NAME = 'POKEMON_QUEUE';

const rabbit = {
  host: process.env.RABBIT_HOST || 'localhost',
  user: process.env.RABBIT_USER || 'admin',
  password: process.env.RABBIT_PASSWORD || 'admin123'
}

async function getRabbitConnection() {
  try {
    const conn = await connect(
      `amqp://${rabbit.user}:${rabbit.password}@${rabbit.host}`
    );
    log('RabbitMQ: Conectado com Sucesso')
    return conn;
  } catch (error) {
    const msg = 'Não foi possível conectar com RabbitMQ: '+error;
    log(msg)
    throw new Error(msg);
  }
}

const conn = await getRabbitConnection();
export const channel = await conn.createChannel();
await channel.assertQueue(QUEUE_NAME);