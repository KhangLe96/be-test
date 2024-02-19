## Installation

```bash
$ npm install
```
## Environment Variables

Some environment variables are used, you should create your own .env file based on .env.example file.
Otherwise, default values will be used.

`WHITELIST_DOMAINS`

`THROTTLE_TTL`

`THROTTLE_LIMIT`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e

# unit tests
$ npm run test:unit
```

## Documentation

- Swagger: [http://localhost:3000/api](http://localhost:3000/api)

## API Reference

#### Get reachable urls

```http
  GET /url-examination
```

| Query | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `priority` | `number` | **Optional**. The priority of the url |

## Tech Stack

- NodeJs, Typescript, NestJs

## Stay in touch

- Author - [Khang Le](https://www.linkedin.com/in/khangle-se/)
