## Environment

```
Node version 18
NPM version 9
```

## Set up

1. Set up `.env` file
1. Start MongoDB and RabbitMQ with docker
    - Ensure all MongoDB and RabbitMQ configs are set in `.env`.
    - Ensure that no other service is running on the same port as the one configured for MongoDB in the `.env` file. (Use the command below to check if there is any other mongo service run in the same port)
        ```
        sudo lsof -iTCP -sTCP:LISTEN | grep mongo
        ```
    - Start docker

        ```
        docker-compose up -d
        docker ps -a
        ```

1. Install modules

    ```
    npm i
    ```

1. Run server (server will run on port 8000)

    ```
    npm start

    # Run with Nodemon
    npm run start:dev
    ```

