import jwt  from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";

export const isAuthenicated = asyncHandler(async (req, res, next) => {
  //check token
  const token = req.headers["token"];
  if (!token) return next(new Error("Token Missed !! 😒", { cause: 404 }));
  // extract payload
  const payload = jwt.verify(token, process.env.SECERT_KEY);
  // check token in db
  const tokenExist = await Token.findOne({ token, isValid: true });
  if (!tokenExist)
    return next(new Error("Token Not Found !! 😒", { cause: 404 }));
  // check user exist
  const user = await User.findById(payload.id);
  if (!user) return next(new Error("User Not Found !! 😒", { cause: 404 }));
  // pass user
  req.user = user;
  return next();
});
