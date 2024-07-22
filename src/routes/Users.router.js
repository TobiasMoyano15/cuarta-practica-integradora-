import { Router } from 'express';
import UserController from '../Controllers/users.controller.js';

const router = Router();
const {
    createUser,
    getUsers,
    getUserBy,
    updateUser,
    removeUser
} = new UserController();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:uid', getUserBy);
router.put('/:uid', updateUser);
router.delete('/:uid', removeUser);

export default router;