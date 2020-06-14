import {
    expect
} from "chai";
import {
    logLevel
} from "src/config";

describe("Unit: Config", () => {
    context("given LOG_LEVEL environment variable is set", () => {
        context("when config module is imported", () => {
            it("should export logLevel value from the environment variable", () => {
                expect(logLevel).to.equal(process.env.LOG_LEVEL);
            });
        });
    });
});
