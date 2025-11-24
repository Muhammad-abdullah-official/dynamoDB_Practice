import { logger } from "../config/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error(err);
  const status = err.status || 500;
  const expose = err.expose || false;
  res
    .status(status)
    .json({ error: expose ? err.message : "Internal Server Error" });
}
