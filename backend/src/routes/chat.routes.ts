import Router from 'express';
import chatController from '../controllers/chat.controller';

const chatRouter = Router();

// Get all chat messages
chatRouter.get('/', chatController.getAllChats);
chatRouter.get('/:room', chatController.getChatsByRoom);

export default chatRouter;