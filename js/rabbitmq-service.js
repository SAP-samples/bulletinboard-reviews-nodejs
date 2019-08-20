'use strict'
const amqp = require('amqplib')
const queueName = 'averageRating:updated'

function RabbitMQService(connectionUri) {
    let connection
    let channel

    const connected = async () => {
        connection = await amqp.connect(connectionUri)
        channel = await connection.createChannel()
    }

    this.stop = async () => {
        await connection.close()
    }

    this.notify = async (message) => {
        await connected()
        await channel.assertQueue(queueName)
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    }
}

module.exports = RabbitMQService;