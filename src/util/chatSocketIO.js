import { chatService } from "../Service/service.js";
import { logger } from "./logger.js";


// Chat socketIO
export const chatSocketIO = (io) => {

    let messages = [];
    io.on('connection', async (socket) => {

        messages = await chatService.getMessages();
        socket.emit('messageLog', messages);
        
        socket.on('message', async data => {
            logger.info('message data: ', data);
            await chatService.createMessage(data.user, data.message);
            messages = await chatService.getMessages();
            io.emit('messageLog', messages);
        });
    })
    }