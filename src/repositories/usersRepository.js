export default class UsersRepository {
    constructor(userDao) {
        this.userDao = userDao;
    }

    getUsers = async () => await this.userDao.getAll();
    getUser = async filter => await this.userDao.getBy(filter);
    createUser = async newUser => await this.userDao.create(newUser);
    updateUser = async (uid, userToUpdate) => await this.userDao.update(uid, userToUpdate);
    deleteUser = async uid => await this.userDao.remove(uid);
}