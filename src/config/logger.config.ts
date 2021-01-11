import { transports, createLogger, format } from "winston";

import { config } from "~config/env.config";

const fileOptions: transports.FileTransportOptions = {
   level: "info",
   filename: config.LOG_FILE,
   handleExceptions: true,
   maxsize: 5242880,
   maxFiles: 5
}

const consoleOptions: transports.ConsoleTransportOptions = {
   level: "info",
   handleExceptions: true,
   format: format.combine(format.colorize(), format.simple())
}

const logger = createLogger({
   transports: [
      new transports.File(fileOptions),
      new transports.Console(consoleOptions)
   ],
   exitOnError: false
});

export const stream = {
   write: function(message: any) {
      logger.info(message);
   }
}

export default logger;