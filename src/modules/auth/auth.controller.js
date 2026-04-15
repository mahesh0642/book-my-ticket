import ApiResponse from '../../common/utils/api-response.js';
import * as authService from './auth.services.js';

export const register = async (req, res) => {
    try {
        const { email, password, name = email.split('@')[0] } = req.body;
        const { user, token } = await authService.register(name, email, password);
        ApiResponse.created(res, "Registration success", { token, user });
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        ApiResponse.ok(res, "Login success", { token, user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ success: false, error: error.message });
    }
}
