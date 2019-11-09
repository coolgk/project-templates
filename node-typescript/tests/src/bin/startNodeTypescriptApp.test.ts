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

describe('Feature: cli', () => {
    const root = resolve(__dirname, '..', '..', '..');

    context('given the tmp exists in the project directory', () => {
        const cwd = resolve(root, 'tmp');

        before((done) => {
            fs.mkdir(cwd, { recursive: true }, done);
        });

        context(`when the cli command is called in the tmp folder
            AND the first argument is "app"`, () => {

            const appDirectory = resolve(cwd, 'app');
            const spawnStub = stub(childProcess, 'spawn');
            let packageJson: Record<string, object | string>;

            before(async () => {
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

                await startNodeTypescriptApp(appDirectory);

                packageJson = require(resolve(appDirectory, 'package.json'));
            });

            after((done) => {
                spawnStub.restore();
                fs.rmdir(appDirectory, { recursive: true }, done);
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

            it('should create the .eslintrc file', () => {
                expect(
                    getFileContent([appDirectory, '.eslintrc'])
                ).to.equal(
                    getFileContent([root, '.eslintrc'])
                );
            });

            it('should create the .gitignore file', () => {
                expect(
                    getFileContent([appDirectory, '.gitignore'])
                ).to.equal(
                    getFileContent([root, '.gitignore'])
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
});

function getFileContent (paths: string[]): string {
    return fs.readFileSync(resolve(...paths), { encoding: 'utf-8' });
}
