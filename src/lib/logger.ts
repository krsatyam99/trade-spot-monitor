import * as bunyan from "bunyan";
const log = bunyan.createLogger({ name: "myapp" });

const logger = {
  debug: (...arg: any) => {
    log.debug(new Date().toISOString(), "DEBUG", ...arg);
  },
  info: (...arg: any) => {
    log.info(new Date().toISOString(), "INFO", ...arg);
  },
  warn: (...arg: any) => {
    log.warn(new Date().toISOString(), "WARN", ...arg);
  },
  error: (...arg: any) => {
    log.error(new Date().toISOString(), "ERROR", ...arg);
  },
};

export default logger;
