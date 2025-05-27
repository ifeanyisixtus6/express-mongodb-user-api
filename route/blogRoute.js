import express from "express"
import { createPost, deleteBlogById, getBlogById, getPosts, updateBlogById} from "../controller/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router =  express.Router();

router.post("/blog", protect, createPost)
router.get("/blog", getPosts)
router.get("/blog/:id", protect,  getBlogById)
router.patch("/blog/:id/",  protect, updateBlogById)
router.delete("/blog/:id", protect, deleteBlogById)
export default router