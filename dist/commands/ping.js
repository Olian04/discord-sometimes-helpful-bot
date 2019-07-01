"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    client.on('message', (message) => {
        // If the message is "ping"
        if (message.content === 'ping') {
            // Send "pong" to the same channel
            message.channel.send('pong');
        }
    });
};
