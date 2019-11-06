# Node + Typescript Project Template

This is generic template for node + typescript projects. The entry point of the app is `src/index.ts`

## NPM Scripts

`NODE_PATH` used in scripts are for improving the readability of `import` statements e.g. Relative paths like `import someModule from '../../../utils/module'` can be written as `import someModule from 'src/utils/module'`

### Development Commands

a `.env` file should be created first. `.env` file is used for for simulating environment variables in deployed environments (e.g. production). This file is used for local dev only, and is NOT used in production or any deployed environment (e.g. test, staging etc).

- `npm run dev` - start the app in local development environment
- `npm run test:dev` - run tests locally
- `npm run lint` - run eslint
- `npm run build:dev` - build typescript with source maps and comments in code are kept
- `npm run mocha` - run customised mocha command e.g. test a single file `npm run mocha -- file-name-or-pattern` this command uses the mocha module installed in the project so you run tests with a consistent mocha version in all environments and you don't have to install mocha globally

### Production Commands

Production commands do not read the `.env` file. Production environment variables are defined in deployed environments.

Do NOT use production commands in the local development environment. They might NOT work as expected because these commands may reply environment variables from actual environments.

- `npm start` - start application
- `npm build` - compile typescript with no source maps and comments are removed from ts files
- `npm test` - run tests

## Quality Control

This project has been configured with three steps of code quality controls

### Pre-Commit Hook

`npm run lint -- --fix` is triggered before each commit. This command fixes linting errors.

### Pre-Push Hook

`npm run test:dev` is triggered before each push. Push will fail if tests fail or test coverage is below the threshold defined in `./.nycrc`.

`npm run audit` is triggered before each push. Push will fail if there are vulnerabilities in dependencies. You should run `npm audit fix` to fix the vulnerabilities and commit the changes before you push again.

## Debug Configurations for VS Code in Windows WSL

https://code.visualstudio.com/remote-tutorials/wsl/run-in-wsl

[launch.json](../.vscode/launch.json) and [tasks.json](../.vscode/tasks.json) in [../.vscode](../.vscode) are VS Code debug configurations.

You can copy these two files into your project's `.vscode` folder and either remove `/node-typescript` path from all the configurations or replace them with appropriate paths.

These configurations have only been tested with projects opened in Windows WSL mode.

- `NodeTS: Start` - starts the app in debug mode
- `NodeTS: Test All` - run tests in debug mode
- `NodeTS: Test Current File` - run test on the current open/focused file e.g. if `someFile.test.ts` is the file in focus, and you pressed the "start debugging" button or Ctrl + F5, this command will run `mocha someFile.test.ts`

## Configuration Files

- ESLint: `.eslintrc` `.eslintignore`
- Mocha: `.mocharc.json`
- Istanbul: `.nycrc`
- Nodemon: `nodemon.json`
- Typescript: `tsconfig.json`