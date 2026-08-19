import { getUsers, saveUsers } from "./userService.js";

// Get all users
export const getAllUsers = () => {
    return getUsers();
};

// Save a new user
export const saveUser = (userData) => {
    const users = getUsers();
    const newUser = {
        id: userData.id || Date.now().toString(),
        ...userData,
        createdAt: userData.createdAt || new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
};

// Find user by email
export const findUserByEmail = (email) => {
    if (!email) return null;
    const users = getUsers();
    return users.find(
        (user) => user.email && user.email.toLowerCase() === email.toLowerCase()
    ) || null;
};

// Find user by ID
export const findUserById = (id) => {
    if (!id) return null;
    const users = getUsers();
    return users.find(
        (user) => String(user.id) === String(id)
    ) || null;
};

export default {
    getAllUsers,
    saveUser,
    findUserByEmail,
    findUserById,
};