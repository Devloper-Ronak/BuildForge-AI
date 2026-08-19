import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

// ======================================================
// File / Directory Setup
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.join(__dirname, "../data");
const usersFile = path.join(dataDirectory, "users.json");

// ======================================================
// Ensure users.json Exists
// ======================================================

const ensureUsersFile = () => {
    try {
        if (!fs.existsSync(dataDirectory)) {
            fs.mkdirSync(dataDirectory, { recursive: true });
        }

        if (!fs.existsSync(usersFile)) {
            fs.writeFileSync(usersFile, JSON.stringify([], null, 2), "utf-8");
        }
    } catch (error) {
        console.error("❌ Failed to initialize users.json:", error.message);
        throw error;
    }
};

// ======================================================
// GET USERS
// ======================================================

export const getUsers = () => {
    try {
        ensureUsersFile();
        const data = fs.readFileSync(usersFile, "utf-8");
        if (!data.trim()) return [];
        const users = JSON.parse(data);
        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error("❌ Error reading users:", error.message);
        return [];
    }
};

// ======================================================
// SAVE USERS
// ======================================================

export const saveUsers = (users) => {
    try {
        ensureUsersFile();
        if (!Array.isArray(users)) {
            throw new Error("Users data must be an array.");
        }
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");
        return true;
    } catch (error) {
        console.error("❌ Error saving users:", error.message);
        throw error;
    }
};

// ======================================================
// FIND USER HELPERS
// ======================================================

export const findUserByEmail = (email) => {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    return users.find((u) => u.email && u.email.toLowerCase() === cleanEmail) || null;
};

export const findUserById = (id) => {
    if (!id) return null;
    const users = getUsers();
    return users.find((u) => u.id === id) || null;
};

export const findUserByGoogleId = (googleId) => {
    if (!googleId) return null;
    const users = getUsers();
    return users.find((u) => u.googleId === googleId) || null;
};

export const findUserByResetTokenHash = (tokenHash) => {
    if (!tokenHash) return null;
    const users = getUsers();
    return users.find(
        (u) =>
            u.resetTokenHash === tokenHash &&
            u.resetTokenExpiresAt &&
            u.resetTokenExpiresAt > Date.now()
    ) || null;
};

// ======================================================
// CREATE / UPDATE USER
// ======================================================

export const createUser = (userData) => {
    const users = getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();

    const newUser = {
        id: userData.id || uuidv4(),
        name: userData.name ? userData.name.trim() : cleanEmail.split("@")[0],
        email: cleanEmail,
        passwordHash: userData.passwordHash || null,
        emailVerified: Boolean(userData.emailVerified),
        avatar: userData.avatar || null,
        googleId: userData.googleId || null,
        authProvider: userData.authProvider || "local", // 'local' | 'google'
        otpHash: userData.otpHash || null,
        otpExpiresAt: userData.otpExpiresAt || null,
        otpAttempts: userData.otpAttempts || 0,
        otpCreatedAt: userData.otpCreatedAt || null,
        resetTokenHash: userData.resetTokenHash || null,
        resetTokenExpiresAt: userData.resetTokenExpiresAt || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: userData.lastLoginAt || new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
};

export const updateUser = (id, updates) => {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
        return null;
    }

    users[index] = {
        ...users[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    saveUsers(users);
    return users[index];
};

export default {
    getUsers,
    saveUsers,
    findUserByEmail,
    findUserById,
    findUserByGoogleId,
    findUserByResetTokenHash,
    createUser,
    updateUser,
};