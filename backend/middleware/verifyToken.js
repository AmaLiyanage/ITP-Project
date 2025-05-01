import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Check for token in cookie 
  if (!token) {
    return res.status(401).json({ success: false, message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.userId = decoded.userId;  // Attach userId to request object
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    console.log("Token verification failed:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
