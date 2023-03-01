import { connect } from 'amqplib';
import env from 'dotenv';

env.config({encoding: 'UTF-8'});

export const QUEUE_NAME = 'POKEMON_QUEUE';

const rabbit = {
    host: process.env.RABBIT_HOST ?? 'localhost',
    user: process.env.RABBIT_USER ?? 'admin',
    password: process.env.RABBIT_PASSWORD ?? 'admin123'
}

const conn = await connect(
  `amqp://${rabbit.user}:${rabbit.password}@${rabbit.host}`
);
export const channel = await conn.createChannel();