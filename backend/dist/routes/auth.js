"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
// Hardcoded user for demo
const USER = {
    id: '1',
    username: 'jacob',
    password: bcryptjs_1.default.hashSync('password', 10),
};
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Username and password required' });
        return;
    }
    // Check credentials
    if (username !== USER.username) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const isValidPassword = await bcryptjs_1.default.compare(password, USER.password);
    if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    // Generate JWT
    const token = jsonwebtoken_1.default.sign({ id: USER.id, username: USER.username }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
    res.json({
        token,
        user: {
            id: USER.id,
            username: USER.username,
        },
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map