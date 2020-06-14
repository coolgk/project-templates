const {
    LOG_LEVEL
} = process.env;

export enum LogLevel {
    Error = "error",
        Debug = "debug",
        Info = "info",
}

export const logLevel = LOG_LEVEL;
