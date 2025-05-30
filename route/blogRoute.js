import express from "express"
import { createPost, deleteBlogById, getBlogById, getPosts, updateBlogById} from "../controller/blogController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";



const router =  express.Router();

router.post("/blog", protect, createPost)
router.get("/blog", getPosts)
router.get("/blog/:id", protect, getBlogById)
router.patch("/blog/:id/",  protect, authorizeRoles("admin"), updateBlogById)
router.delete("/blog/:id", protect, authorizeRoles("admin"), deleteBlogById)
export default router