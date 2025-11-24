import jwt from "jsonwebtoken";

import { dotenv } from "dotenv";
dotenv.config();

export const jwtToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startswith(" Bearer"))
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or token expired" });
  }
};
