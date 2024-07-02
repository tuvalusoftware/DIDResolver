import amqp from "amqplib";

class Rabbit {
    constructor(url) {
        this.url = url;
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(this.url);
            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error("Error connecting to RabbitMQ:", error.message);
            throw error;
        }
    }

    async publish(queue, message) {
        try {
            await this.channel.assertQueue(queue);
            await this.channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(message))
            );
        } catch (error) {
            console.error("Error publishing message:", error.message);
            throw error;
        }
    }

    async consume(queue, callback) {
        try {
            await this.channel.assertQueue(queue);
            this.channel.consume(queue, (msg) => {
                if (msg !== null) {
                    callback(message);
                    this.channel.ack(msg);
                }
            });
        } catch (error) {
            console.error("Error consuming messages:", error.message);
            throw error;
        }
    }

    async close() {
        try {
            if (this.connection) {
                await this.connection.close();
                console.log("RabbitMQ connection closed.");
            }
        } catch (error) {
            console.error("Error closing RabbitMQ connection:", error.message);
            throw error;
        }
    }
}

export default Rabbit;
