import usermodel from './models/usermodel.js';

export class UsersManagerMongo {
  constructor() {
    this.usermodel = usermodel;
  }

  async getUsers({ limit = 10, numPage = 1 }) {
    const users = await this.usermodel.paginate({}, { limit, page: numPage, sort: { price: -1 }, lean: true });
    return users;
  }

  async createUser(user) {
    return await this.usermodel.create(user);
  }

  async getUserBy(filter) {
    return this.usermodel.findOne(filter);
  }

  async updateUser(filter, updatedUser) {
    return await this.usermodel.updateOne(filter, { $set: updatedUser });
  }

  async deleteUser(filter) {
    return await this.usermodel.deleteOne(filter);
  }

  async getUserByEmail(email) {
    return await this.usermodel.findOne({ email: email });
  }
}
 export default UsersMongo