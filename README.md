# NestJS Blog

<!-- <a href="https://travis-ci.org/bashleigh/nestjs-blog"><img src="https://travis-ci.org/bashleigh/nestjs-blog.svg?branch=master"/></a>
<a href='https://coveralls.io/github/bashleigh/nestjs-blog?branch=master'><img src='https://coveralls.io/repos/github/bashleigh/nestjs-blog/badge.svg?branch=master' alt='Coverage Status' /></a> -->

This is an example of how to use [nestjs](https://github.com/nestjs/nest) with jwt and typeorm to build a basic blog API.

## Use

- Start the postgreSql container using docker

```bash
$ docker-compose up -d
```

- Start the nestjs process using to following

```bash
$ npm start
```

### Production

If you're going to use this example in production (or your own verison of it) it's recommended to run using the 'complied' JS version from dist. You can do this by using the following command

```bash
$ npm start:prod
```

> This command will also clean and build your dist folder

## Development

For development, the best command to use is

```bash
$ npm start:dev
```

This will start watch mode to reload our script when there's been any changes in the src directory

## Testing

#### Unit testing

Unit tests can be ran by simply using the `test` script

```bash
$ npm test
```

This will run jest on all `.spec.ts` files.

#### End to End testing (E2E)

End to end tests can be run by using the following command

```bash
$ npm test:e2e
```

this will run jest on all `.e2e-spec.ts` files.

#### Coverage

Use jest to show you a coverage of your tests

```bash
$ npm test:cov
```

# Packages

I used a variety of packages to develop this example api. Here's a list of them and where I got them from

- Nestjs
  - [@nestjs/typeorm](https://github.com/nestjs/typeorm) A typeorm module for nestjs
  - [@nestjs/passport](https://github.com/nestjs/passport) An easy to use module for passport include AuthGuards
  - [@nestjs/jwt](https://github.com/nestjs/jwt) A JWT module for nestjs
- nestjs-community
  - [nestjs-config](https://github.com/nestjs-community/nestjs-config) A config module for nestjs (envs)
- [typeorm](https://github.com/typeorm/typeorm) typeorm is an orm for TypeScript

# Links

- swagger
- [https://localhost:7000/api/](https://localhost:700/api/) for production
- [https://localhost:7000/api/](https://localhost:700/api/) for development
