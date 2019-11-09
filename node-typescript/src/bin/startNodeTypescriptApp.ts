#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import packageJson from '../../package.json';

export default async function startNodeTypescriptApp (directory = '.'): Promise<void> {
    // eslint-disable-next-line no-console
    console.info('Initialising Project\n');
    const projectDirectory = createProjectDirectory(directory);

    copyFiles(projectDirectory);

    await initPackageJson(projectDirectory);

    // eslint-disable-next-line no-console
    console.info('Installing Dependencies\n');
    await installDevDependencies(projectDirectory, Object.keys(packageJson.devDependencies));

    updatePackageJson(projectDirectory, packageJson);
}

function runCommand (command: string, commandArguments: string[], options: { cwd: string }): Promise<number> {
    return new Promise((resolve) => {
        const commandProcess = childProcess.spawn(command, commandArguments, options);
        commandProcess.stdout.pipe(process.stdout);
        commandProcess.stderr.pipe(process.stderr);
        commandProcess.on('close', (code) => code && process.exit(code) || resolve(code));
    });
}

function initPackageJson (cwd: string): Promise<number> {
    return runCommand('npm', ['init', '-y'], { cwd });
}

function installDevDependencies (cwd: string, devDependencies: string[]): Promise<number> {
    return runCommand(
        'npm',
        ['i', '-D', ...devDependencies],
        { cwd }
    );
}

function createProjectDirectory (directory: string): string {
    const subDirectories = [
        '',
        'src',
        'tests/src',
        'dist',
        'tmp'
    ].map((subDirectory) => path.resolve(directory, subDirectory));

    subDirectories.forEach((subDirectory) => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.mkdirSync(subDirectory, { recursive: true });
    });

    return subDirectories[0];
}

function copyFiles (directory: string): void {
    const files = [
        ['src/index.ts'],
        ['tests/src/index.test.ts'],
        ['tests/setup.ts'],
        ['.eslintignore'],
        ['.eslintrc.json'],
        ['.gitignore'],
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

        const templateFile = path.resolve(__dirname, '..', '..', templateFilename);

        if (templateFilename === '.eslintrc.json') {
            // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
            const eslintrc = require(templateFile);

            // eslint-disable-next-line security/detect-non-literal-fs-filename
            fs.writeFileSync(
                targetFile,
                JSON.stringify(
                    { ...eslintrc, rules: undefined },
                    null,
                    4
                ),
                {
                    encoding: 'utf-8'
                }
            );
        } else {
            fs.copyFileSync(templateFile, targetFile);
        }
    });
}

function updatePackageJson (directory: string, templatePackageJson: Record<string, string | object>): void {
    const targetPackageJsonPath = path.resolve(directory, 'package.json');
    // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
    const targetPackageJson = require(targetPackageJsonPath);

    const properties = [
        'scripts', 'main', 'husky'
    ];

    properties.forEach((property) => {
        // eslint-disable-next-line security/detect-object-injection
        if (targetPackageJson[property]) {
            // eslint-disable-next-line security/detect-object-injection
            targetPackageJson[`${property}.original`] = targetPackageJson[property];
        }
        // eslint-disable-next-line security/detect-object-injection
        targetPackageJson[property] = templatePackageJson[property];
    });

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(targetPackageJsonPath, JSON.stringify(targetPackageJson, null, 4));
}
