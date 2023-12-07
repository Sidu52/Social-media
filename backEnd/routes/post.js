const express = require('express');
const passport = require('passport');
const router = express.Router();

const { toggleLike, toggleComment, getcomments, editComment, getNotification, createNotification,updateNotification } = require('../controller/postopration');

router.post('/like', toggleLike);
router.post('/comment', toggleComment);
router.get('/', getcomments);
router.put('/comment', editComment);
router.post('/notificationget', getNotification)
router.post('/notification', createNotification)
router.post('/notificationUpdate', updateNotification)

module.exports = router;