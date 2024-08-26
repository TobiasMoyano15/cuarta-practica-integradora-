import UserModel from '../models/usermodel.js';

class UsersMongo {
  constructor() {
    this.UserModel = UserModel;
  }

  create = async (newUser) => {
    try {
      return await this.UserModel.create(newUser);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  };

  getAll = async ({ limit = 10, numPage = 1 } = {}) => {
    try {
      return await this.UserModel.paginate({}, { limit, page: numPage, sort: { _id: -1 }, lean: true });
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  };

  getBy = async (filter) => {
    try {
      return await this.UserModel.findOne(filter).lean();
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  };

  update = async (uid, updatedUser) => {
    try {
      const result = await this.UserModel.updateOne({ _id: uid }, { $set: updatedUser });
      if (result.matchedCount === 0) {
        throw new Error('Usuario no encontrado');
      }
      return result;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  };

  remove = async (filter) => {
    try {
      const result = await this.UserModel.deleteOne(filter);
      if (result.deletedCount === 0) {
        throw new Error('Usuario no encontrado');
      }
      return result;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  };
}

export default UsersMongo;
