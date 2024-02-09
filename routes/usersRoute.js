const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/usersControllers');
const { signUp } = require('../controllers/authControllers');

const router = express.Router();

router.post('/signUp', signUp);

router.route('/').get(getUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;