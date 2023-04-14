// server/utils/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../utils/middleware');
const connection = require('../db');
const router = express.Router();
const SALT_ROUNDS = 10;
const JWT_SECRET = 'your-jwt-secret';

// POST /register
router.post('/register', (req, res) => {
	console.log('Received request body:', req.body);
	const { email, username, password } = req.body;
	if (!email || !username || !password) {
		res.status(400).json({ message: 'Invalid request' });
		return;
	}

	connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
			return;
		}

		if (results.length > 0) {
			res.status(409).json({ message: 'Email already exists' });
			return;
		}

		bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: 'Server error' });
				return;
			}

			const newUser = { email, username, password: hash };
			connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
				if (err) {
					console.error(err);
					res.status(500).json({ message: 'Server error' });
					return;
				}
				const userId = results.insertId;
				const token = jwt.sign({ userId: userId, email: email, username: username }, JWT_SECRET, {
					expiresIn: '1h',
				});
				res.status(201).json({ message: 'User created successfully', userId: userId, token: token });
			});
		});
	});
});

// POST /login
router.post('/login', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400).json({ message: 'Invalid request' });
		return;
	}

	connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
			return;
		}

		if (results.length === 0) {
			res.status(401).json({ message: 'Invalid email or password' });
			return;
		}

		const user = results[0];
		bcrypt.compare(password, user.password, (err, result) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: 'Server error' });
				return;
			}

			if (!result) {
				res.status(401).json({ message: 'Invalid email or password' });
				return;
			}

			const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, JWT_SECRET, {
				expiresIn: '1h',
			});

			res.status(200).json({
				userId: user.id,
				token: token,
				username: user.username,
			});
		});
	});
});

// POST /logout
router.post('/logout', authenticateJWT, (req, res) => {
	res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
