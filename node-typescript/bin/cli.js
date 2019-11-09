#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

(async function () {
    console.info('Initialising Project\n');
    const projectDirectory = createProjectDirectory(process.argv[2]);

    copyFiles(projectDirectory);

    await initPackageJson(projectDirectory);
    console.info('Installing Dependencies\n');

    await installDevDependencies(projectDirectory);

    updatePackageJson(projectDirectory);
})();

function runCommand(command, commandArguments, options) {
    return new Promise((resolve) => {
        const commandProcess = spawn(command, commandArguments, options);
        commandProcess.stdout.pipe(process.stdout);
        commandProcess.stderr.pipe(process.stderr);
        commandProcess.on('close', (code) => code && process.exit(code) || resolve());
    });
}

function initPackageJson(cwd) {
    return runCommand('npm', ['init', '-y'], { cwd });
};

function installDevDependencies(cwd) {
    const devDependencies = [
        "@istanbuljs/nyc-config-typescript",
        "@types/chai",
        "@types/mocha",
        "@types/node",
        "@types/sinon",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "chai",
        "dotenv",
        "eslint",
        "husky",
        "mocha",
        "nodemon",
        "nyc",
        "sinon",
        "source-map-support",
        "supertest",
        "ts-node",
        "typescript"
    ];

    return runCommand(
        'npm',
        ['i', '-D', ...devDependencies],
        { cwd }
    );
}

function createProjectDirectory(directory = '.') {
    const subDirectories = [
        '',
        'src',
        'tests/src',
        'dist',
        'tmp'
    ].map(subDirectory => path.resolve(directory, subDirectory));

    subDirectories.forEach((subDirectory) => {
        fs.mkdirSync(subDirectory, { recursive: true });
    });

    return subDirectories[0];
}

function copyFiles(directory) {
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

        if (fs.existsSync(targetFile)) {
            const basename = path.basename(targetFile);
            fs.copyFileSync(targetFile, `${targetFile}.original`);
            console.info(`renamed existing ${basename} to ${basename}.original`);
        }

        fs.copyFileSync(
            path.resolve(__dirname, '..', 'template', templateFilename),
            targetFile
        );
    });
}

function updatePackageJson(directory) {
    const targetPackageJsonPath = path.resolve(directory, 'package.json');
    const templatePackageJson = require('../template/package.json');
    const targetPackageJson = require(targetPackageJsonPath);

    const properties = [
        'scripts', 'main', 'husky'
    ];

    properties.forEach((property) => {
        if (targetPackageJson[property]) {
            targetPackageJson[`${property}.original`] = targetPackageJson[property];
        }
        targetPackageJson[property] = templatePackageJson[property];
    });

    fs.writeFileSync(targetPackageJsonPath, JSON.stringify(targetPackageJson, null, 4));
};