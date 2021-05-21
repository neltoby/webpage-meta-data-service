## Description

This is a graphql api service that retrieves metadata from a webpage built with [Nest](https://github.com/nestjs/nest) framework. 

## Installation

```bash
$ npm install
```

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
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Dockerized Installation

```bash
#Run this command to build an image
$ docker build -t <IMAGE NAME>[:tag] .

#Run this command to containerize the image(run the image in a container)
$ docker run -dp 3000:3000 <IMAGE NAME>
```

## Dockerized Test

```bash
#To run any of the test specified in the Test section above in your container
#Execute this command first
$ docker exec -it <CONTAINER ID> /bin/sh

#Run any of the test instrucions above eg
$ npm test
```
