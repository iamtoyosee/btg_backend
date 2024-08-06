const express = require("express");
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
} = require("../controllers/postController");
const { isUserAuthenticated } = require("../controllers/authController");

const router = express.Router();


router.route('/:postid').get( getPost);


router
  .route("/:postid")
  .delete( deletePost)
  .patch( updatePost);

router
  .route("/")
  .get( getAllPosts)
  .post(isUserAuthenticated, createPost);

module.exports = router;
