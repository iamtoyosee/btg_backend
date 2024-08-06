const mongoose = require("mongoose");

// const PostSchema = mongoose.Schema({
//   userid: {
//     type: String,
//     required: [true, "Empty userid "],
//   },
//   username: {
//     type: String,
//     required: [true, "Empty username "],
//   },
//   content:{
//     type: String,
//     required: [true, 'Cannot Post Empty Comment']
//   },
//   date: {
//     type: Date,
//   },
//   comment: {
//     type: Number,
//     default: 0
//   }
// });

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
  },

  // comments: [
  //   {
  //     text: String,
  //     author: String,
  //     createdAt: { type: Date, default: Date.now },
  //   },
  // ],
});

//convert schema to model

module.exports = mongoose.model("posts", PostSchema);
