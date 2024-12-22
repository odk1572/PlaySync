import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    deleteUserAccount,      
    getUserVideos, 
    deleteWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Register a user with avatar and cover image upload
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

// Login a user
router.route("/login").post(loginUser);

// Logout a user (requires JWT verification)
router.route("/logout").post(verifyJWT, logoutUser);

// Refresh access token
router.route("/refresh-token").post(refreshAccessToken);

// Change current password (requires JWT verification)
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// Get the current logged-in user's details
router.route("/c").get(verifyJWT, getCurrentUser);

// Update account details (requires JWT verification)
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// Update user avatar (requires JWT verification)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// Update user cover image (requires JWT verification)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// Get user channel profile by username (requires JWT verification)
router.route("/c/:username").get(getUserChannelProfile);

// Get user's watch history (requires JWT verification)
router.route("/history").get(verifyJWT, getWatchHistory);

// Delete user account (requires JWT verification)
router.route("/delete-account").delete(verifyJWT, deleteUserAccount);

router.route("/c/:username/videos").get(getUserVideos);
router.route("/delete-watch-history").delete(verifyJWT, deleteWatchHistory);


export default router;
