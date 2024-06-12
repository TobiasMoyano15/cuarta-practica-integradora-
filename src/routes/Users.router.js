import { Router } from 'express';
import { UsersManagerMongo } from '../dao/UsersMongo.js';

const router = Router();
const userService = new UsersManagerMongo();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.send({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { body } = req;
    try {
        const result = await userService.createUser(body);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Obtener un usuario por ID
router.get('/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userFound = await userService.getUserBy({ _id: uid });
        if (!userFound) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.send({ status: 'success', payload: userFound });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Actualizar un usuario por ID
router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    const { first_name, last_name, password } = req.body;

    try {
        const userFound = await userService.getUserBy({ _id: uid });
        if (!userFound) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }
        
        const updatedUser = {};
        if (first_name) updatedUser.first_name = first_name;
        if (last_name) updatedUser.last_name = last_name;
        if (password) updatedUser.password = password;

        if (Object.keys(updatedUser).length === 0) {
            return res.status(400).send({ status: 'error', message: 'No hay nada para actualizar' });
        }

        const result = await userService.updateUser({ _id: uid }, updatedUser);

        res.status(200).send({ status: 'success', message: 'Usuario actualizado', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Eliminar un usuario por ID
router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userFound = await userService.deleteUser({ _id: uid });
        if (!userFound) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.send({ status: 'success', message: `Usuario ${uid} eliminado` });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;
