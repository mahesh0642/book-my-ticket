import ApiError from "../../common/utils/api-error.js";
import { createUsers, getUserByEmail } from "./auth.models.js";
import bcrypt from 'bcrypt';
import { generateAccessToken } from "../../common/utils/jwt.utils.js";

export const register = async (name = 'Guest', email, password) => {
    name = name || email.split('@')[0] || 'User';
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUsers(name, email, hashedPassword);
    const token = generateAccessToken({ id: user.id, email: user.email, name: user.name });

    const { password_hash, ...userWithoutPassword } = user;
    return { 
        user: userWithoutPassword, 
        token 
    };
};

export const login = async (email, password) => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = generateAccessToken({ id: user.id, email: user.email, name: user.name });
    const { password_hash, ...userWithoutPassword } = user;
    
    return { 
        user: userWithoutPassword, 
        token 
    };
}
