import { channel, QUEUE_NAME } from "../config/rabbitmq.config.js";
import { log } from 'debug';

export function consumeFromQueue() {
    return channel.consume(QUEUE_NAME, (message) => {
        log(message.content.toString());
        channel.ack(message);
    });
}