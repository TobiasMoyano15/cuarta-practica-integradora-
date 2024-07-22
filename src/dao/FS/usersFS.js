import fs from 'node:fs';
import __dirname from '../util/filenameUtils.js';
import { logger } from '../util/logger.js';

const path = `${__dirname}/files/Users.json`;

class UsersDaoFS {
    constructor() {
        this.path = path;
    }

    readUsersJson = async () => {
        try {
            const usersJson = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(usersJson);
        } catch (error) {
            logger.error('Error al leer el archivo:', error);
            return [];
        }
    };

    writeUserJson = async (userData) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(userData, null, '\t'), 'utf-8');
        } catch (error) {
            logger.error('Error al escribir en el archivo:', error);
        }
    };

    create = async (first_name, last_name, email, age, password, cart, role) => {
        try {
            const newUser = {
                id: await this.getNextId(),
                first_name,
                last_name,
                email,
                age,
                password,
                cart,
                role
            };

            const usersData = await this.readUsersJson();
            const emailExistsCheck = usersData.find((usr) => usr.email === email);
            const mandatoryDataCheck = [];

            for (const prop in newUser) {
                if (!newUser[prop]) {
                    mandatoryDataCheck.push(prop);
                }
            }

            if (!newUser.email || !newUser.password) {
                const errorMessage = `¡ERROR! debe llenar todos los campos\nFaltaron agregar ${mandatoryDataCheck.join(', ')}`;
                throw new Error(mandatoryDataCheck.length > 1 ? errorMessage : errorMessage.replace('Faltaron agregar', 'Faltó agregar'));
            }

            if (typeof email !== 'string' || typeof password !== 'string' || typeof first_name !== 'string' || typeof last_name !== 'string' || typeof role !== 'string' || typeof cart !== 'string') {
                throw new Error("email, password, first_name, last_name, role y cart deben ser string");
            }

            if (typeof age !== 'number') {
                throw new Error("Edad debe ser numérico");
            }

            if (emailExistsCheck) {
                throw new Error(`¡ERROR! El email ${newUser.email} ya está siendo utilizado, por favor utiliza otro email o inicia sesión`);
            }

            usersData.push(newUser);
            await this.writeUserJson(usersData);
            return usersData;
        } catch (error) {
            logger.error('Error al agregar usuario:', error);
            throw error;
        }
    };

    getAll = async () => {
        return await this.readUsersJson();
    };

    getBy = async (filter) => {
        try {
            const userData = await this.readUsersJson();
            const foundUser = userData.find(user => user.filter === filter);
            if (!foundUser) throw new Error(`No se encontró el usuario con el filtro: ${filter}`);
            return foundUser;
        } catch (error) {
            logger.error('Error al obtener usuario por filtro:', error);
            throw error;
        }
    };

    update = async (userId, updatedUser) => {
        try {
            const userData = await this.readUsersJson();
            const userIndex = userData.findIndex(usr => usr.id === userId);

            if (userIndex === -1) {
                throw new Error(`El usuario con el id: ${userId} no existe`);
            }

            const newUpdatedUser = {
                ...userData[userIndex],
                ...updatedUser
            };

            userData[userIndex] = newUpdatedUser;
            await this.writeUserJson(userData);
            return userData;
        } catch (error) {
            logger.error('Error al actualizar usuario:', error);
            throw error;
        }
    };

    remove = async (userId) => {
        try {
            const userData = await this.readUsersJson();
            const userToDeleteIndex = userData.findIndex(usr => usr.id === userId);

            if (userToDeleteIndex === -1) {
                throw new Error(`No existe el usuario con id: ${userId}`);
            }

            logger.info(`El usuario ${userData[userToDeleteIndex].email} con el id ${userId} fue eliminado`);
            userData.splice(userToDeleteIndex, 1);
            await this.writeUserJson(userData);
        } catch (error) {
            logger.error('Error al eliminar usuario:', error);
            throw error;
        }
    };

    getNextId = async () => {
        const userData = await this.readUsersJson();
        if (userData.length === 0) {
            return 1;
        }
        return userData[userData.length - 1].id + 1;
    };
}

export default UsersDaoFS;
