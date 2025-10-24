import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: number; username: string };
    req.User = decoded; // Attach the user info to the request
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
