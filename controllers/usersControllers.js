const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');


exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
})

exports.getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json({
        status: 'success',
        data: { user }
    });
})

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is not defined yet.'
    });
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is not defined yet.'
    });
}