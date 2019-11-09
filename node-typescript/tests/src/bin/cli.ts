import { expect } from 'chai';
import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
// import { exec } from 'child_process';

describe('Feature: cli', () => {
    const root = resolve(__dirname, '..', '..', '..');

    context('given the cwd tmp exists', () => {
        const cwd = resolve(root, 'tmp');
        before(() => {
            mkdirSync(cwd, { recursive: true });
        });
        context(`when the cli command is called in the tmp folder
            AND the first argument is "app"`, () => {

            before(() => {
                const cliPath = resolve(root, 'src', 'bin', 'cli.ts');
                console.log(cliPath);

                // exec('node -r ts-node/register ' + cliPath, { cwd }, done);
            });

            it('should create an app folder', () => {
                expect(existsSync(resolve(cwd, 'app'))).to.be.true;
            });
        });
    });
});
