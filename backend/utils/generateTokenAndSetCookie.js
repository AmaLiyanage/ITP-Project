import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  // Generate JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", 
  });

  // Set the token in a secure cookie
  res.cookie("token", token, {
    httpOnly: true,  // Cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === "production",  //cookie should only be sent over secure HTTPS connections
    sameSite: "strict",  // Prevents the cookie from being sent on cross-origin requests
    maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expiration: 7 days
  });

  // Return the token (if needed elsewhere)
  return token;
};
