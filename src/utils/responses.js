export const success = (res, data, status = 200) =>
  res.status(status).json({ data });
export const error = (res, message = "Internal Server Error", status = 500) =>
  res.status(status).json({ error: message });
