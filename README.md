# DID Resolver for Cardano

## Description

DID resolver for Cardano, work with DIDController and Cardano Service

## Set Up and Installation

1. Install all dependencies

    ```
    npm i
    ```

1. Set up environment variables, create _.env_ file with the followings content

    ```
    DID_CONTROLLER=https://github-fuixlabs.ap.ngrok.io
    CARDANO_SERVICE=https://cardano-fuixlabs.ap.ngrok.io
    AUTHENTICATION_SERVICE=https://auth-fuixlabs.ap.ngrok.io
    ```

## Run server

```
npm run start

<!-- Run with nodemon -->
npm run start:dev
```

Result:

```
DID Resolver RESTfull API server start on: 8000
```

_[Swagger link](http://localhost:8000/api-docs/) (after run server successfully)_
