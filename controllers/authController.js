const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError("Please enter an email or password", 400));
  }
  const user = await Users.findOne({ email }).select("+password");
  if (user && (await user.comparePassword(password, user.password))) {
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      data: {
        username: user.username,
        userid: user._id,
        token,
      },
    });
  } else {
    next(new AppError("Invalid Email or Password", 400));
  }
});

exports.userSignup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const newuser = await Users.create({
      email,
      password,
    });

    const token = signToken(newuser._id);
    res.status(200).json({
      status: "success",
      message: "Registration Successful",
      data: {
        username: newuser.username,
        useid: newuser._id,
        token,
      },
    });
  } catch (e) {

    res.status(400).json({
      status: "fail",
      message: "An account with that email address already exists. Please log in to continue."

    })
  }
});

exports.isUserAuthenticated = catchAsync(async (req, res, next) => {
  //Get the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    next(new AppError("You are not logged in, Please Log in", 401));
  }
  // 2) verify token
  const verification = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  console.log(token)

  // 3) Check if user still exists
  const currentUser = await Users.findById(verification.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(verification.iat)) {
  //   return next(
  //     new AppError(
  //       "User recently changed password! Please log in again.",
  //       401
  //     )
  //   );
  // }
  next();
});

exports.changePassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "password changed successfully",
  });
});
