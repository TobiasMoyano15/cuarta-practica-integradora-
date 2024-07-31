import UserModel from './models/usermodel.js';

class UsersMongo {
  constructor() {
    this.userModel = userModel;
  }
  create = async (newUser) => await userModel.create(newUser);
  getAll = async ({ limit = 10, numPage = 1 } = {}) => await this.userModel.paginate({}, { limit, page: numPage, sort: { price: -1 }, lean: true });
  getBy = async (filter) => userModel.findOne(filter).lean();
  update = async (uid, updatedUser) => await userModel.updateOne({_id: uid}, { $set: updatedUser });
  remove = async (filter) => await userModel.deleteOne(filter);
};

export default UsersMongo;