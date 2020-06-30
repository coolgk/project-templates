#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import packageJson from '../../package.json';

function createProjectDirectory(directory: string): string {
  const subDirectories = [
    '',
    'src/routes/root',
    'src/routes/users',
    'src/middleware',
    'src/utils',
    'tests/src',
    'tests/src/routes/root',
    'tests/src/routes/users',
    'dist',
    'tmp'
  ].map((subDirectory) => path.resolve(directory, subDirectory));

  subDirectories.forEach((subDirectory) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.mkdirSync(subDirectory, { recursive: true });
  });

  return subDirectories[0];
}

function copyFiles(templateDirectory: string, directory: string): void {
  const files = [
    ['src/server.ts'],
    ['src/app.ts'],
    ['src/config.ts'],
    ['src/utils/logger.ts'],
    ['src/routes/route.ts'],
    ['src/routes/root/root.controller.ts'],
    ['src/routes/users/users.controller.ts'],
    ['src/routes/users/users.service.ts'],
    ['src/middleware/cache-forever.ts'],
    ['tests/utils.ts'],
    ['tests/setup.ts'],
    ['tests/src/server.test.ts'],
    ['tests/src/app.test.ts'],
    ['tests/src/routes/root/root.controller.test.ts'],
    ['tests/src/routes/users/users.controller.test.ts'],
    ['.eslintignore'],
    ['.eslintrc.json'],
    ['.npmignore', '.gitignore'],
    ['.mocharc.json'],
    ['.nycrc'],
    ['nodemon.json'],
    ['README.md'],
    ['tsconfig.json'],
    ['.env.example', '.env']
  ];

  files.forEach(([templateFilename, targetFilename]) => {
    const targetFile = path.resolve(directory, targetFilename || templateFilename);

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (fs.existsSync(targetFile)) {
      const basename = path.basename(targetFile);
      fs.copyFileSync(targetFile, `${targetFile}.original`);
      // eslint-disable-next-line no-console
      console.info(`renamed existing ${basename} to ${basename}.original`);
    }

    const templateFile = path.resolve(templateDirectory, templateFilename);
    fs.copyFileSync(templateFile, targetFile);
  });
}

function runCommand(command: string, commandArguments: string[], options: { cwd: string }): Promise<number> {
  return new Promise((resolve) => {
    const commandProcess = childProcess.spawn(command, commandArguments, {
      ...options,
      detached: true,
      stdio: 'inherit'
    });
    commandProcess.on('close', (code) => (code && process.exit(code)) || resolve(code));
  });
}

function initPackageJson(cwd: string): Promise<number> {
  return runCommand('npm', ['init', '-y'], { cwd });
}

function installDependencies(cwd: string, dependencies: string[], flags: string[] = []): Promise<number> {
  return runCommand('npm', ['i', ...flags, ...dependencies], { cwd });
}

function updatePackageJson(directory: string, templatePackageJson: Record<string, unknown>): void {
  const targetPackageJsonPath = path.resolve(directory, 'package.json');
  // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
  const targetPackageJson = require(targetPackageJsonPath) as Record<string, unknown>;

  const properties = ['scripts', 'main', 'husky', 'lint-staged'];

  properties.forEach((property) => {
    // eslint-disable-next-line security/detect-object-injection
    // if (targetPackageJson[property]) {
    //   // eslint-disable-next-line security/detect-object-injection
    //   targetPackageJson[`${property}.original`] = targetPackageJson[property];
    // }
    // eslint-disable-next-line security/detect-object-injection
    targetPackageJson[property] = templatePackageJson[property];
  });

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(targetPackageJsonPath, JSON.stringify(targetPackageJson, null, 4));
}

export default async function startNodeTypescriptApp(templateDirectory: string, directory = '.'): Promise<void> {
  // eslint-disable-next-line no-console
  console.info('Initialising Project\n');
  const projectDirectory = createProjectDirectory(directory);

  copyFiles(templateDirectory, projectDirectory);

  await initPackageJson(projectDirectory);

  const devDependencies = Object.keys(packageJson.devDependencies);
  // eslint-disable-next-line no-console
  console.info(`Installing Dev Dependencies: ${devDependencies.join(', ')}\n\n`);
  await installDependencies(projectDirectory, devDependencies, ['-D']);

  const dependencies = Object.keys(packageJson.dependencies);
  // eslint-disable-next-line no-console
  console.info(`Installing Dependencies: ${dependencies.join(', ')}\n\n`);
  await installDependencies(projectDirectory, dependencies, ['-S']);

  updatePackageJson(projectDirectory, packageJson);
}
