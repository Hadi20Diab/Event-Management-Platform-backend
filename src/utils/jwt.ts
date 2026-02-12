import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string; // your secret in .env
const JWT_EXPIRES_IN = "7d"; // token valid for 7 days

// Generate a token
export const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify a token
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
