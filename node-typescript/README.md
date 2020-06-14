# A Node + Typescript + Mocha + Nyc + Eslint + Nodemon Template Generator

This is a generic template for node + typescript projects. It bootstraps a template project with [some popular packages](#Configuration-Files) and [npm script commands](#NPM-Scripts) pre-configured.

The entry point of the app is `src/index.ts`

## Usage

create a new project in a new `folder`

`npx create-node-typescript-app <folder>`

or inside the project directory

`npm init node-typescript-app` or `npx create-node-typescript-app .`

or install this module globally

`npm i -g create-node-typescript-app`

and run

`create-node-typescript-app <folder>`

## NPM Scripts

### Development Commands

A `.env` file should be created first. In this template, `.env` file is used for creating environment variables in the local dev environment. This file is used for local dev only, it is NOT used in the deployed environment (e.g. test, staging, prod etc). How you want to build env variables in your CI/CD process is not in the scope of this template.

- `npm run dev` - start the app in development mode (it reads the local .env file)
- `npm run test:dev` - run tests locally (reads local .env)
- `npm run lint` - run eslint
- `npm run format` - run prettier
- `npm run build:dev` - build typescript with source maps and comments in code are kept
- `npm run mocha` - a helper npm script for running customised mocha command e.g. test a single file `npm run test:one -- file-name-or-pattern`

### Production Commands

Production commands do not read the `.env` file. How you want to build environment variables in production environments is not in the scope of this template.

Do NOT use production commands in the local development environment. They might NOT work as expected because these commands may reply environment variables from actual environments.

- `npm start` - start application
- `npm build` - compile typescript with no source maps and comments are removed from ts files
- `npm test` - run tests

### NODE_PATH

`NODE_PATH` used in scripts are for improving the readability of `import` statements e.g. Relative paths like `import someModule from '../../../utils/module'` can be written as `import someModule from 'src/utils/module'`

## Quality Control

This project has been configured with three steps of code quality controls

### Pre-Commit Hook

`eslint --cache --fix` is triggered before each commit. This command tries to fix linting errors when it is possible.

`eslint` has been configured to also check and fix formatting errors detected by `prettier`. (https://prettier.io/docs/en/integrating-with-linters.html)

### Pre-Push Hook

`npm run test:dev` is triggered before each push. Push will fail if tests fail or test coverage is below the threshold defined in `./.nycrc`.

`npm run audit` is triggered before each push. Push will fail if there are vulnerabilities in dependencies. You should run `npm audit fix` to fix the vulnerabilities and commit the changes before you push again.

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
- JS Beautifier: `.jsbeautifyrc`

Why not `prettier`?

`prettier` is an opinionated formatter, they do not accept basic feature requests such as `space-before-function-paren`, and suggest prettier users should just follow their way of doing things (https://github.com/prettier/prettier-vscode/issues/494).

`js-beautify` is less opinionated and has more formatting options.
