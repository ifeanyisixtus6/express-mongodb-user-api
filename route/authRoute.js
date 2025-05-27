import express from "express";
import {login, signUp }from "../controller/authController.js"

const router = express.Router();

router.post('/auth/login', login)
router.post("/auth/signUp", signUp)

export default router