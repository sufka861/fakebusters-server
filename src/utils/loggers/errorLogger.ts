import { createLogger, transports, format } from "winston";
const { combine, timestamp, simple } = format;

const logger = createLogger({
  level: "error",
  format: combine(timestamp(), simple()),
  transports: [
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

export default logger;
