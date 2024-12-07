import { User } from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import randomstring from "randomstring";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { resetPassTemp } from "../../utils/htmlTamplates.js";


export const signUp = asyncHandler(async (req, res, next) => {
  // take data from body
  const { email } = req.body;
  //check user
  let userExist = await User.findOne({ email });
  if (userExist) return next(new Error("User already exist ", { cause: 409 }));

  const user = await User.create({ ...req.body});
  // generate token
  const token = jwt.sign({ email, id: user._id }, process.env.SECERT_KEY);
  await Token.create({ token, user: user._id });
  // create user
 
  
  // send resonse
  return res.status(201).json({
    success: true,
    mesaage: "Resiter Successfully✅",
    token
  });
});
export const signIn = asyncHandler(async (req, res, next) => {
  // data from request
  const { email, password } = req.body;
  // check user
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found ", { cause: 404 }));
  // compare password
  const match = bcryptjs.compareSync(password, user.password);
  console.log("Password match:", match);
  if (!match) return next(new Error("invalid password "));
  // generate token
  const token = jwt.sign({ email, id: user._id }, process.env.SECERT_KEY);
  // save token
  await Token.create({ token, user: user._id });
  res.json({ success: true, results: { token } });
});

export const forgertCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  // check user
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));
  // generate code
  const forgertCode = randomstring.generate({
    charset: "numeric",
    length: 5,
  });
  // save forget code
  user.forgetCode = forgertCode;
  await user.save();
  // send email
  const messageSent = await sendEmail({
    to: email,
    subject: "Reset Password",
    html: resetPassTemp(forgertCode),
  });
  if (!messageSent) return next(new Error("Something Wrong! email not sent! "));
  return res.json({ success: true, message: "Check your email " });
});
// reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Extract data from request
  const { email, password, forgetCode } = req.body;

  // Check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User Not Found", { cause: 404 }));

  // Validate forget code
  if (forgetCode !== user.forgetCode)
    return next(new Error("Code is Invalid"));

  // Update password
  user.password = bcryptjs.hashSync(password, parseInt(process.env.SALT_ROUND));
  await user.save();

  // Invalidate all tokens
  const tokens = await Token.find({ user: user._id });

  // Await all token invalidations
  await Promise.all(
    tokens.map(async (token) => {
      token.isValid = false;
      await token.save();
    })
  );

  // Send success response
  res.json({
    success: true,
    message: "Try to login again",
  });
});

