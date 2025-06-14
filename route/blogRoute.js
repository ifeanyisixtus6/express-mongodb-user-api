import express from "express"
import { createBlog, getBlogs, getBlogById, getMyBlog, updateBlogById, deleteBlogById} from "../controller/blogController.js";
import { protect } from "../middleware/authMiddleware.js";



const router =  express.Router();

router.post("/blog", protect, createBlog)
router.get("/blog", getBlogs)
router.get("/blog/my-blog", protect, getMyBlog)
router.get("/blog/:id", getBlogById)
router.patch("/blog/:id/",  protect, updateBlogById)
router.delete("/blog/:id", protect, deleteBlogById)
export default router