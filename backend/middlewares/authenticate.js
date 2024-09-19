const { default: axios } = require("axios");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandling");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token, refreshToken } = req.cookies;

    if (!token && !refreshToken) {
        return next(new ErrorHandler("Login first to handle this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});



exports.isautherizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
        }
        next()
    }
};