## Environment

```
Node version 18
NPM version 9
```

## Start development
1. Set up `.env` file
2. Start MongoDB and RabbitMQ with docker
    - Ensure all MongoDB and RabbitMQ configs are set in `.env`.
    - Ensure that no other service is running on the same port as the one configured for MongoDB in the `.env` file. (Use the command below to check if there is any other mongo service run in the same port)
        ```
        sudo lsof -iTCP -sTCP:LISTEN | grep mongo
        ```
    - Start docker

        ```
        docker-compose -f ./docker-compose.dev.yml up -d
        docker ps -a
        ```
    - Watch logs

        ```
        docker logs -f service
        ```

## Start production
1. Set up `.env` file
2. Start MongoDB and RabbitMQ with docker
    - Ensure all MongoDB and RabbitMQ configs are set in `.env`.
    - Ensure that no other service is running on the same port as the one configured for MongoDB in the `.env` file. (Use the command below to check if there is any other mongo service run in the same port)
        ```
        sudo lsof -iTCP -sTCP:LISTEN | grep mongo
        ```
    - Start docker

        ```
        docker-compose -f ./docker-compose.yml up -d
        docker ps -a
        ```
    - Watch logs

        ```
        docker logs -f resolver-service
        ```
