import { createLogger, format, transports } from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";
const LOG_ALL_STACKTRACES = process.env.LOG_ALL_STACKTRACES === "true";
const LOG_FORMAT = process.env.LOG_FORMAT ?? "simple";
const DISABLE_LOGS = process.env.DISABLE_LOGS == "true";

const logger = createLogger({
  level: LOG_LEVEL,
  silent: DISABLE_LOGS,
  format: format.combine(
    format((info) => {
      // Only log stack traces when the log level is error or the
      // LOG_ALL_STACKTRACES environment variable is set to true
      if (info.stack && info.level !== "error" && !LOG_ALL_STACKTRACES) {
        delete info.stack;
      }
      return info;
    })(),
    format.errors(),
    format.timestamp(),
    LOG_FORMAT === "json" ? format.json() : format.simple()
  ),
  transports: new transports.Console(),
});

export default logger;
