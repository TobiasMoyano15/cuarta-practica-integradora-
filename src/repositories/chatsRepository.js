export default class ChatsRepository {
    constructor(chatsDao) {
        this.chatsDao = chatsDao;
    }

    createMessage = async (user, message) => await this.chatsDao.create(user, message);
    getMessages = async () => await this.chatsDao.getAll();
    getMessage = async filter => await this.chatsDao.getBy(filter);
    updateMessage = async (mid, chatToUpdate) => await this.chatsDao.update(mid, chatToUpdate);
    deleteMessage = async mid => await this.chatsDao.remove(mid);
}