import { LogglyTracker } from "loggly-jslogger";
const logger = new LogglyTracker();
logger.push({ logglyKey: "YOUR CUSTOMER TOKEN HERE" });
export default logger;
