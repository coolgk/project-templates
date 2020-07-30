# An Express + Typescript + Mocha + Nyc + Eslint + Nodemon + Prettier Template Generator

This is a template for expressjs + typescript projects. It bootstraps a template project with [some popular packages](#Configuration-Files) and some pre-configured [npm script commands](#NPM-Scripts).

The entry point of the app is `src/server.ts`

## Usage

create a new project in a new `folder`

`npx create-typescript-express-app <folder>`

or inside the project directory

`npm init typescript-express-app` or `npx create-typescript-express-app .`

or install this module globally

`npm i -g create-typescript-express-app`

and run

`create-typescript-express-app <folder>`

## NPM Scripts

### Development Commands

A `.env` file should be created first. In this template, `.env` file is used for creating environment variables in the local dev environment. This file is used for local dev only, it is NOT used in the deployed environment (e.g. test, staging, prod etc). How you want to build env variables in your CI/CD process is not in the scope of this template.

- `npm run dev` - start the app in development mode (it reads the local .env file)
- `npm run test:dev` - run tests locally (reads local .env)
- `npm run test:watch` - run tests locally (reads local .env) in watch mode
- `npm run lint` - run eslint
- `npm run format` - run prettier
- `npm run build:dev` - build typescript with source maps and comments in code are kept
- `npm run mocha` - a helper npm script for running customised mocha command e.g. test a single file `npm run mocha -- file-name-or-pattern`

### Production Commands

Production commands do not read the `.env` file. How you want to build environment variables in production environments is not in the scope of this template.

Do NOT use production commands in the local development environment. They might NOT work as expected because these commands may reply environment variables from the actual environments.

- `npm start` - start application
- `npm build` - compile typescript with no source maps and comments are removed from ts files
- `npm test` - run tests and coverage report

### NODE_PATH

`NODE_PATH` used in scripts are for improving the readability of `import` statements e.g. Relative paths like `import someModule from '../../../utils/module'` can be written as `import someModule from 'src/utils/module'`

## Quality Control

This project has been configured with three steps of code quality controls

### Pre-Commit Hook

`eslint --fix` is triggered before each commit. This command tries to fix linting errors when it is possible.

`eslint` has been configured to also check and fix formatting errors detected by `prettier`. (https://prettier.io/docs/en/integrating-with-linters.html)

### Pre-Push Hook

`npm run test:dev` is triggered before each push. Push will fail if tests fail or test coverage is below the threshold defined in `./.nycrc`.

`npm run audit` is triggered before each push. Push will fail if there are vulnerabilities in dependencies. You should run `npm audit fix` to fix the vulnerabilities and commit the changes before you push again.

## Template Folder Structure

If you have your own folder structure, just delete `tests` folder and everything in `src` folder except for `src/server.ts`

```yaml
dist -- target folder for `npm build` (git ignored)
src -- source folder, all source code
  src/middleware - you can put your common middleware here
  src/middleware/cache-forever.ts - an example middleware which sets the Cache-Control header
  src/routes - all urls available from the service
  src/route/root - urls at root level
  src/route/root/index.ts - a handlers for /favicon.ico /robots.txt /health-check endpoints
  src/routes/users/index.ts - an example route handler
  src/services/user-service.ts - an example service/helper/model
  src/utils - utility helpers
  src/utils/loggers.ts - winston logger
  src/validation-schemas - joi schemas
  src/validation-schemas/config-schema.ts - joi schemas for config file
  src/app.ts - creates an express object
  src/config.ts - configuration file, validated with joi schema, app will fail to start if config is invalid
  src/server.ts - start the http server
tests - test related files
  tests/src - all tests
  tests/utils.ts - helper function for tests
  tests/setup.ts - test setup file
tmp - tmp folder for coverage output etc. (git ignored)
.env - environment variables for DEVELOPMENT environment
```

## Debug Configurations for VS Code in Windows WSL

[Run VS Code in Windows Subsystem for Linux](https://code.visualstudio.com/remote-tutorials/wsl/run-in-wsl)

Copy [launch.json](.vscode/launch.json) and [tasks.json](.vscode/tasks.json) from the [.vscode](.vscode) folder to your project's `.vscode` folder.

These configurations have only been tested with projects opened in Windows WSL mode.

- `Start (NodeTS WSL)` - starts the app in debug mode
- `Test All (NodeTS WSL)` - run tests in debug mode
- `Test Current File (NodeTS WSL)` - run test on the current open/focused file e.g. if `someFile.test.ts` is the file in focus, and you pressed the "start debugging" button or Ctrl + F5, this command will run `mocha someFile.test.ts`

## Configuration Files

- ESLint: `.eslintrc.json` `.eslintignore`
- Mocha: `.mocharc.json`
- Istanbul: `.nycrc`
- Nodemon: `nodemon.json`
- Typescript: `tsconfig.json`
- Prettier: `.prettierrc`

## Windows Users

you might need to install dev dependencies globally
