#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const projectDirectory = createProjectDirectory(process.argv[2]);

initPackageJson(projectDirectory, () => installDevDependencies(projectDirectory));

function runCommand(command, commandArguments, options, next) {
    const commandProcess = spawn(command, commandArguments, options);
    commandProcess.stdout.pipe(process.stdout);
    commandProcess.stderr.pipe(process.stderr);
    commandProcess.on('close', (code) => code && process.exit(code) || next && next());
}

function initPackageJson(cwd, next) {
    runCommand('npm', ['init', '-y'], { cwd }, next);
};

function installDevDependencies(cwd, next) {
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

    runCommand(
        'npm',
        ['i', '-D', ...devDependencies],
        { cwd },
        next
    );
}

function createProjectDirectory(directory = '.') {
    const projectDirectory = path.resolve(directory);
    fs.mkdirSync(projectDirectory, { recursive: true });
    return projectDirectory;
}

function getProjectFolders() {
    return [
        'src',
        'tests/src',
        'tmp'
    ];
}