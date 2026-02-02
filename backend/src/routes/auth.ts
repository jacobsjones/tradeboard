import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Hardcoded user for demo
const USER = {
  id: '1',
  username: 'jacob',
  password: bcrypt.hashSync('password', 10),
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

  const isValidPassword = await bcrypt.compare(password, USER.password);
  if (!isValidPassword) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // Generate JWT
  const token = jwt.sign(
    { id: USER.id, username: USER.username },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: USER.id,
      username: USER.username,
    },
  });
});

export default router;
