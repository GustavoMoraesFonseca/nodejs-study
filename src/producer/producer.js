import { channel, QUEUE_NAME } from '../config/rabbitmq.config.js';

export function publishInQueue(message) {
    const jsonMsg = JSON.stringify(message); 
    return channel.sendToQueue(QUEUE_NAME, Buffer.from(jsonMsg));
}