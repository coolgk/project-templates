/* eslint-disable security/detect-non-literal-require */
/* eslint-disable security/detect-non-literal-fs-filename */
import { expect } from 'chai';
import { resolve } from 'path';
import fs from 'fs';
import childProcess, { ChildProcessWithoutNullStreams } from 'child_process';
import { stub, match } from 'sinon';
import { Stream } from 'stream';

import startNodeTypescriptApp from 'src/bin/startNodeTypescriptApp';
import packageJsonTemplate from 'package.json';

function getFileContent (paths: string[]): string {
    return fs.readFileSync(resolve(...paths), { encoding: 'utf-8' });
}

describe('Feature: cli', () => {
    const root = resolve(__dirname, '..', '..', '..');
    const cwd = resolve(root, 'tmp');
    const appDirectory = resolve(cwd, 'app');

    const spawnStub = stub(childProcess, 'spawn');

    before(() => {
        fs.mkdirSync(cwd, { recursive: true });

        spawnStub
            .withArgs(
                'npm',
                match.array.contains(['i', '-D']),
                match.any
            )
            .returns({
                stdout: new Stream(),
                stderr: new Stream(),
                on: (event: string, callback: () => {}) => {
                    event === 'close' && callback();
                }
            } as ChildProcessWithoutNullStreams);

        spawnStub.callThrough();
    });

    after(() => {
        spawnStub.restore();
        fs.rmdirSync(appDirectory, { recursive: true });
    });

    context('given the app directory does not exist', () => {
        context(`when startNodeTypescriptApp("app") is called`, () => {
            let packageJson: Record<string, object | string>;

            before(async function () {
                // eslint-disable-next-line no-invalid-this
                this.timeout(10000);
                await startNodeTypescriptApp(root, appDirectory);
                packageJson = require(resolve(appDirectory, 'package.json'));
            });

            it('should create an app folders', () => {
                expect(fs.existsSync(appDirectory)).to.be.true;
                expect(fs.existsSync(resolve(appDirectory, 'dist'))).to.be.true;
                expect(fs.existsSync(resolve(appDirectory, 'tmp'))).to.be.true;
            });

            it('should create the src/index.ts file', () => {
                expect(
                    getFileContent([appDirectory, 'src', 'index.ts'])
                ).to.equal(
                    getFileContent([root, 'src', 'index.ts'])
                );
            });

            it('should create the tests/src/index.test.ts file', () => {
                expect(
                    getFileContent([appDirectory, 'tests', 'src', 'index.test.ts'])
                ).to.equal(
                    getFileContent([root, 'tests', 'src', 'index.test.ts'])
                );
            });

            it('should create the tests/setup.ts file', () => {
                expect(
                    getFileContent([appDirectory, 'tests', 'setup.ts'])
                ).to.equal(
                    getFileContent([root, 'tests', 'setup.ts'])
                );
            });

            it('should create the .env file', () => {
                expect(
                    getFileContent([appDirectory, '.env'])
                ).to.equal(
                    getFileContent([root, '.env.example'])
                );
            });

            it('should create the .eslintignore file', () => {
                expect(
                    getFileContent([appDirectory, '.eslintignore'])
                ).to.equal(
                    getFileContent([root, '.eslintignore'])
                );
            });

            it('should create the .eslintrc.json file', () => {
                const eslintrcTemplate = JSON.parse(getFileContent([root, '.eslintrc.json']));
                delete eslintrcTemplate.rules;

                expect(
                    JSON.parse(getFileContent([appDirectory, '.eslintrc.json']))
                ).to.deep.equal(
                    eslintrcTemplate
                );
            });

            it('should create the .gitignore file', () => {
                expect(
                    getFileContent([appDirectory, '.gitignore'])
                ).to.equal(
                    getFileContent([root, '.npmignore'])
                );
            });

            it('should create the .mocharc.json file', () => {
                expect(
                    getFileContent([appDirectory, '.mocharc.json'])
                ).to.equal(
                    getFileContent([root, '.mocharc.json'])
                );
            });

            it('should create the .nycrc file', () => {
                expect(
                    getFileContent([appDirectory, '.nycrc'])
                ).to.equal(
                    getFileContent([root, '.nycrc'])
                );
            });

            it('should create the nodemon.json file', () => {
                expect(
                    getFileContent([appDirectory, 'nodemon.json'])
                ).to.equal(
                    getFileContent([root, 'nodemon.json'])
                );
            });

            it('should create the README.md file', () => {
                expect(
                    getFileContent([appDirectory, 'README.md'])
                ).to.equal(
                    getFileContent([root, 'README.md'])
                );
            });

            it('should create the tsconfig.json file', () => {
                expect(
                    getFileContent([appDirectory, 'tsconfig.json'])
                ).to.equal(
                    getFileContent([root, 'tsconfig.json'])
                );
            });

            it('should add scripts to package.json file', () => {
                expect(packageJson.scripts).to.deep.equal(packageJsonTemplate.scripts);
            });

            it('should add main to package.json file', () => {
                expect(packageJson.main).to.deep.equal(packageJsonTemplate.main);
            });

            it('should add hooks to package.json file', () => {
                expect(packageJson.husky).to.deep.equal(packageJsonTemplate.husky);
            });

            it('should install dependencies', () => {
                expect(spawnStub.lastCall.args).to.deep.equal([
                    'npm',
                    ['i', '-D', ...Object.keys(packageJsonTemplate.devDependencies)],
                    { cwd: appDirectory }
                ]);
            });
        });
    });

    context('given the app directory contains an existing project', () => {
        context(`when startNodeTypescriptApp("app") is called`, () => {
            let packageJson: Record<string, object | string>;

            before(async function () {
                // eslint-disable-next-line no-invalid-this
                this.timeout(10000);
                process.chdir(appDirectory);
                await startNodeTypescriptApp(root);
                packageJson = require(resolve(appDirectory, 'package.json'));
            });

            it('should rename existing files', () => {
                expect(
                    fs.existsSync(resolve(appDirectory, '.env.original'))
                ).to.be.true;

                expect(
                    fs.existsSync(resolve(appDirectory, '.eslintignore.original'))
                ).to.be.true;

                expect(
                    fs.existsSync(resolve(appDirectory, '.eslintrc.json.original'))
                ).to.be.true;


                expect(
                    fs.existsSync(resolve(appDirectory, '.gitignore.original'))
                ).to.be.true;

                expect(
                    fs.existsSync(resolve(appDirectory, '.mocharc.json.original'))
                ).to.be.true;

                expect(
                    fs.existsSync(resolve(appDirectory, '.nycrc.original'))
                ).to.be.true;

                expect(
                    fs.existsSync(resolve(appDirectory, 'nodemon.json.original'))
                ).to.be.true;

                expect(
                    fs.existsSync(resolve(appDirectory, 'README.md.original'))
                ).to.be.true;

                expect(
                    fs.existsSync(resolve(appDirectory, 'tsconfig.json.original'))
                ).to.be.true;
            });

            it('should rename existing values in package.json', () => {
                expect(packageJson).to.have.property('scripts.original');
                expect(packageJson).to.have.property('husky.original');
                expect(packageJson).to.have.property('main.original');
            });
        });
    });
});

