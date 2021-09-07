const express = require("express");
const router = express.Router();
const db = require("../config/database");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const postsCtrl = require("../controllers/posts");

//
router.get("/", auth, postsCtrl.getAllPosts);
router.get("/:id", auth, postsCtrl.getOnePost);
router.put("/:id", auth, multer, postsCtrl.updateOnePost);
router.post("/:id", auth, multer, postsCtrl.deletePost);
router.post("/", auth, multer, postsCtrl.createPost);

module.exports = router;
