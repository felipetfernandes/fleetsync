import { User } from "@/types/types";
import jwt from "jsonwebtoken";

function verifyJwt(token: string): User | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!); // ou process.env.AUTH_SECRET
  } catch (err) {
    return null;
  }
}

export default verifyJwt;
