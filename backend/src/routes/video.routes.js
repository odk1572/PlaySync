import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    getSubscribedVideos,    // New route
    getSearchResults,        // New route
    getRelatedVideos,        // New route
    incrementViewCount,     
    getAllVideosUploadedById ,
    getAllVideosUploadedByUser
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Video routes
router
    .route("/")
    .get(getAllVideos) // Public access to get all videos
    .post(
        verifyJWT, // Ensure user is authenticated before uploading
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        publishAVideo // Handler for publishing a video
    );

router
    .route("/:videoId")
    .get(getVideoById) // Get video by ID
    .delete(verifyJWT, deleteVideo) // Protected route for deleting a video
    .patch(
        verifyJWT, // Ensure user is authenticated
        upload.single("thumbnail"),
        updateVideo // Handler for updating video details
    );

// Route for toggling publish status of a video
router.route("/publish/:videoId").patch(verifyJWT, togglePublishStatus); // Ensure authentication
router.route("/uploaded/:userId").get(getAllVideosUploadedById);
// New routes based on the updated controller
router
    .route("/subscribed")
    .get(verifyJWT, getSubscribedVideos); // Ensure authentication

router
    .route("/search")
    .get(getSearchResults); // Public access for searching videos

router
    .route("/related/:videoId")
    .get(getRelatedVideos); // Public access for related videos

router
    .route("/view/:videoId")
    .patch(incrementViewCount); // Increment view count for a video
router.route("/uploaded").post(getAllVideosUploadedById);
router.route("/uploaded/:userId").get(getAllVideosUploadedByUser);
export default router;
