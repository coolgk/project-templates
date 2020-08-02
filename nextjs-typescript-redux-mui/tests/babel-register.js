/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// https://github.com/mochajs/mocha-examples/tree/master/packages/typescript-babel

const register = require('@babel/register').default;
register({ extensions: ['.ts', '.tsx', '.js', '.jsx'] });
