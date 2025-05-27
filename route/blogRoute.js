import express from "express"
import { createPost, deleteBlogById, getBlogById, getPosts, updateBlogById} from "../controller/blogController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleBasedMiddleware.js";


const router =  express.Router();

router.post("/blog", protect, authorizeRoles, createPost)
router.get("/blog", getPosts)
router.get("/blog/:id", protect, authorizeRoles, getBlogById)
router.patch("/blog/:id/",  protect, authorizeRoles, updateBlogById)
router.delete("/blog/:id", protect, authorizeRoles, deleteBlogById)
export default router