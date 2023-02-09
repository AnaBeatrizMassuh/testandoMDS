import express from "express";
import formidable from "express-formidable";

const router = express.Router();

//middleware
import { requireSignin, canEditDeletePost, isAdmin }  from "../middlewares";

// controllers
import { createPost,
        uploadImage, 
        postByUser, 
        userPost, 
        updatePost, 
        deletePost, 
        newsFeed,
        likePost,
        unlikePost,
        addComment,
        removeComment,
        totalPosts,
        totalFeed,
        getPost,
        posts
     } from "../controllers/post";

router.post("/create-post", requireSignin, createPost);
router.post(
    "/upload-image", 
    requireSignin, 
    formidable({maxFileSize: 5*1024*1024}), 
    uploadImage
);

router.get("/user-posts", requireSignin, postByUser);
router.get("/user-post/:_id", requireSignin, userPost);
router.put("/update-post/:_id", requireSignin, canEditDeletePost, updatePost);
router.delete(
    "/delete-post/:_id", 
    requireSignin, 
    canEditDeletePost, 
    deletePost
    );

router.get("/news-feed/:page", requireSignin, newsFeed);
router.get("/total-feed/:page", requireSignin, totalFeed);

router.put("/like-post", requireSignin, likePost);
router.put("/unlike-post", requireSignin, unlikePost);

router.put("/add-comment", requireSignin, addComment);
router.put("/remove-comment", requireSignin, removeComment);

router.get("/total-posts", totalPosts);

router.get("/post/:id", getPost);

router.get("/posts", posts);

//admin
router.delete("/admin/delete-post/:_id", requireSignin, isAdmin, deletePost);

module.exports = router;