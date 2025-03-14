import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  // Generate JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",  // Token expiration: 7 days
  });

  // Set the token in a secure cookie
  res.cookie("token", token, {
    httpOnly: true,  // Cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === "production",  // Use HTTPS in production
    sameSite: "strict",  // Strict SameSite policy for CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expiration: 7 days
  });

  // Return the token (if needed elsewhere)
  return token;
};
