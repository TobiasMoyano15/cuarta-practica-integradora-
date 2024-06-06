import { Router } from 'express';
import { usermodel } from '../dao/models/usermodel.js';

const router = Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await usersModel.find({});
        res.send({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { body } = req;
    try {
        const result = await usersModel.create(body);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Obtener un usuario por ID
router.get('/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userFound = await usersModel.findById(uid);
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
        const userFound = await usersModel.findById(uid);
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

        const result = await usersModel.findByIdAndUpdate(uid, updatedUser, { new: true });

        res.status(200).send({ status: 'success', message: 'Usuario actualizado', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Eliminar un usuario por ID
router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userFound = await usersModel.findByIdAndDelete(uid);
        if (!userFound) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.send({ status: 'success', message: `Usuario ${uid} eliminado` });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;
