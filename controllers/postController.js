const Posts = require("../models/posts");
const Comments = require("../models/comments");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const fs = require("fs");
const path = require('path');


exports.getAllPosts = catchAsync(async (req, res, next) => {
  const allPosts = await Posts.find().sort({
    _id: -1,
    userid: -1,
    username: -1,
    content: -1,
    comment: -1,
    date: -1,
  });
  res.status(200).json({
    status: "success",
    result: allPosts.length,
    data: allPosts,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  console.log(ext);
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { title, summary, author, content, tags} = req.body;
  const newpost = await Posts.create({
    title,
    summary,
    author,
    content,
    tags,
    cover: newPath 
  });

 ;

  res.status(200).json({
    status: "success",
    data: req.file,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const postid = req.params.postid;

  // Check if file is uploaded
  let newFilePath = null;
  if (req.file) {
    const { originalname, path: filePath } = req.file;
    const ext = path.extname(originalname);
    newFilePath = filePath + ext;

    // Rename the file
    fs.renameSync(filePath, newFilePath);
  }

  const { title, summary, author, content, tags } = req.body;

  // Update the post
  const updatedPost = await Posts.findByIdAndUpdate(
    postid,
    { title, summary, content, tags, cover: newFilePath }, // Include cover if updated
    { new: true } // Return the updated document
  );

  if (!updatedPost) {
    return next(new AppError("Post does not exist!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Post updated successfully",
    data: updatedPost,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const postid = req.params.postid;
  console.log(postid)
  const delpost = await Posts.findByIdAndDelete(postid);
  if (delpost === null) {
    next(new AppError("post does not exist !", 400));
  }
  // const postComments = await Comments.find();
  // postComments.map(async (item) => {
  //   item.postid === postid ? await Comments.findByIdAndDelete(item._id) : null;
  // });
  res.status(200).json({
    status: "success",
    message: "post deleted successfully",
    data: delpost._id,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const postid = req.params.postid;
  if (!postid) {
    next(new AppError("Invalid userId !", 400));
  }
  console.log(postid);
  const userPost = await Posts.findById(postid);
  
  if (userPost === null) {
    next(new AppError("This user has no existing post !", 400));
  }
  res.status(200).json({
    status: "success",
    result: userPost.length,
    data: userPost,
  });
});
