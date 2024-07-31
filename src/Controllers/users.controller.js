import { userService } from '../Service/service.js';

class UserController {
    constructor() {
        this.userService = userService;
    }

    getUsers = async (req, res) => {
        try {
            const users = await userService.getUsers();
            res.send({ status: 'success', payload: users.docs });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    getUserBy = async (req, res) => {
        const { uid } = req.params;
        try {
            const userFound = await userService.getUser({ _id: uid });
            res.send({ status: 'success', payload: userFound });

        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    createUser = async (req, res) => {
        const { body } = req;
        try {
            const result = await userService.createUser(body);
            res.send({ status: 'success', payload: result });

        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }

    };

    updateUser = async (req, res) => {
        const { uid } = req.params;
        const { first_name, last_name, password } = req.body;

        try {
            const userFound = await userService.getUser({ _id: uid });
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

            const result = await userService.updateUser({ _id: uid }, updatedUser);

            if (result.nModified === 0) {
                return res.status(400).send({ status: 'error', message: 'No se hicieron cabios en el usuario' });
            }

            res.status(200).send({ status: 'success', message: `Usuario actualizado ${result}` });

        } catch (error) {
            res.status(500).send({ status: 'Error', message: error });
        }
    };
    updateRole = async (req, res) => {
        const { uid } = req.params;
        const { role } = req.body;

        const validRoles = ['user', 'premium'];
        if (!validRoles.includes(role)) {
            return res.status(400).send({ status: 'error', error: 'El rol a cambiar no es valido, debe ser user o premium' });
        }

        try {
            const userFound = await userService.getUser({ _id: uid });
            if (!userFound || userFound.role === 'admin') {
                return res.status(404).send({ status: 'error', message: 'No existe el usuario, o no esta atorizado a cambiar este usuario' });
            }

            const userRoleToUpdate = await userService.updateUser({ _id: uid }, { role: role });

            res.status(200).send({ status: 'success', message: `Usuario actualizado con el nuevo rol ${role}` });

        } catch (error) {
            res.status(500).send({ status: 'Error', message: error });
        }
    };

    removeUser = async (req, res) => {
        const { userEmail } = req.params;
        try {
            const userFound = await userService.removeUser({ email: userEmail });
            res.send({ status: 'success', payload: `user: ${userFound} deleted` });
        } catch (error) {
            res.status(500).send({ status: 'Error', message: error });
        }
    };
}

export default UserController;