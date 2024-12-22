import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Retrieve the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        console.log("Extracted Token:", token);  // Log the token for debugging
        console.log("ACCESS_TOKEN_SECRET is being used for validation");  // Avoid logging the actual secret
        
        // Allow unauthenticated access to specific routes (e.g., /api/v1/videos)
        if (req.method === 'POST' && req.path === '/api/v1/videos') {
            console.warn("Accessing /api/v1/videos without authentication"); // Logging for debugging
            return next(); 
        }

        // If no token is provided, send an error
        if (!token) {
            console.error("No token provided");
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        // Verify token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            console.error("JWT verification error:", error.message); // Log specific error
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(401, "Access token has expired");
            }
            throw new ApiError(401, "Invalid access token");
        }

        console.log("Decoded Token:", decodedToken);  // Log decoded token for debugging

        // Fetch user details associated with the decoded token
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        
        if (!user) {
            console.error("User not found for the provided token");
            throw new ApiError(401, "Invalid access token: User not found");
        }

        req.user = user;  // Attach the user to the request object

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("JWT verification failed:", error);  // Log the error details for debugging
        const errorMessage = error.message || "Error verifying access token";
        throw new ApiError(401, errorMessage);
    }
});
