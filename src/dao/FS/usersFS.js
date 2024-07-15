import fs from 'node:fs';
import __dirname from '../util/filenameUtils.js';

const path = `${__dirname}/FS-Database/Users.json`;
class UsersDaoFS {

    constructor(path) {
        this.path = path;
    }

    readUsersJson = async () => {
        try {
            const usersJson = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(usersJson);
        } catch (error) {
            return [];
        }
    };

    writeUserJson = async (userData) => {
        await fs.promises.writeFile(this.path, JSON.stringify(userData, null, '\t'), 'utf-8');
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
                if (mandatoryDataCheck.length > 1)
                    throw new Error(`¡ERROR! debe llenar todods los campos\nFaltaron agregar ${mandatoryDataCheck.join(', ')}`);
                throw new Error(`¡ERROR! debe llenar todods los campos\nFaltó agregar ${mandatoryDataCheck.join(', ')}`);
            };

            if (typeof email !== 'string' || typeof password !== 'string' || typeof first_name !== 'string' || typeof last_name !== 'string' || typeof role !== 'string' || typeof cart !== 'string') {
                throw new Error("email, password, first_name, last_name y role deben ser string");
            }

            if (typeof age !== 'number') {
                throw new Error("Edad debe ser numérico");
            }


            if (emailExistsCheck) {
                throw new Error(`¡ERROR! El mail ${newUser.title} ya está siendo utlizado, porfavor utiliza otro email, o inicia sesión`);
            };

            usersData.push(newUser);
            this.writeUserJson(usersData);
            return usersData;

        } catch (error) {
            return error;
        }
    };

    getAll = async () => {
        return await this.readUsersJson();
    };

    getBy = async (filter) => {
        try {
            const userData = await this.readUsersJson();
            const foundUser = userData.find(prod => prod.filter === filter);
            return foundUser;
        } catch (error) {
            return error;
        }
    };

    update = async (userId, updatedUser) => {
        try {
            const userData = await this.readUsersJson();
            const userIndex = await userData.findIndex(usr => usr.id === userId);

            if (await userIndex === -1) {
                throw new Error(`El usuario con el id: ${userId} no existe`);
            }

            const updatedUser = {
                ...userData[userIndex],
                ...updatedUser
            };

            userData[userIndex] = updatedUser;
            this.writeUserJson(userData);
            return userData;

        } catch (error) {
            throw new Error('Error', error);
        }
    };

    remove = async (userId) => {
        const userData = await this.readUsersJson();
        const userToDeleteIndex = userData.findIndex(usr => usr.id === userId);

        if (userToDeleteIndex === -1) {
            return `No existe el producto con id: ${userId}`;
        }
        console.log(`EL usuario ${userData[userToDeleteIndex].email} con el id ${userId} fue eliminado`);
        userData.splice(userToDeleteIndex, 1);
        this.writeUserJson(userData);
    };

    getNextId = async () => {
        const userData = await this.readUsersJson();
        if (userData.length === 0) {
            return 1;
        };
        return userData[userData.length - 1].id + 1;
    };
};

export default UsersDaoFS;