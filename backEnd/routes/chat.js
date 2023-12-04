const express = require('express');
const router = express.Router();


const { conversationCreate,
    conversationGetByUserID,
    messageCreated,
    messageGetByConversationId } = require('../controller/Chat')

router.get('/conversation/:id', conversationGetByUserID);
router.post('/conversation', conversationCreate);
router.post('/message', messageCreated);
router.get('/message/:conversationId', messageGetByConversationId);



module.exports = router;

