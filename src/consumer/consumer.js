import { channel, QUEUE_NAME } from "../config/rabbitmq.config.js";
import { log } from 'debug';

export async function consumeFromQueue() {
    try {
        return await channel.consume(QUEUE_NAME, (message) => {
            log(message.content.toString());
            channel.ack(message);
        });
    } catch (error) {
        log('Erro ao consumir: '+error);
    }
}