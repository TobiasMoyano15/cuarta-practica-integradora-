import { userService } from '../Service/service.js';

class UserController {
    constructor() {
        this.userService = userService;
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.userService.getUsers();
            res.send({ status: 'success', payload: users.docs });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }

    getUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const userFound = await this.userService.getUserBy({ _id: uid });
            if (!userFound) {
                return res.status(404).send({ status: 'error', message: 'User not found' });
            }
            res.send({ status: 'success', payload: userFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }

    createUser = async (req, res) => {
        const { body } = req;
        try {
            const result = await this.userService.createUser(body);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }

    updateUser = async (req, res) => {
        const { uid } = req.params;
        const { first_name, last_name, password } = req.body;

        try {
            const userFound = await this.userService.getUserBy({ _id: uid });
            if (!userFound) {
                return res.status(404).send({ status: 'error', message: 'User not found' });
            }

            const updatedUser = {};
            if (first_name) updatedUser.first_name = first_name;
            if (last_name) updatedUser.last_name = last_name;
            if (password) updatedUser.password = password;

            if (Object.keys(updatedUser).length === 0) {
                return res.status(400).send({ status: 'error', message: 'No hay nada para actualizar' });
            }

            const result = await this.userService.updateUser({ _id: uid }, updatedUser);

            if (result.nModified === 0) {
                return res.status(400).send({ status: 'error', message: 'No se hicieron cambios en el usuario' });
            }

            res.status(200).send({ status: 'success', message: `Usuario actualizado ${result}` });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error });
        }
    }

    deleteUser = async (req, res) => {
        const { userEmail } = req.params;
        try {
            const userFound = await this.userService.deleteUser({ email: userEmail });
            if (!userFound) {
                return res.status(404).send({ status: 'error', message: 'User not found' });
            }
            res.send({ status: 'success', payload: `User: ${userFound} deleted` });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error });
        }
    }
}

export default UserController;
