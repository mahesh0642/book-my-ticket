import ApiResponse from '../../common/utils/api-response.js';
import * as authService from './auth.services.js';

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const { user, token } = await authService.register(name, email, password);
        ApiResponse.created(res, "Registration success", { user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        ApiResponse.ok(res, "Login success", { user, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
