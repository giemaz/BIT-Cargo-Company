// server\routes\boxesRoutes.js
const express = require('express');
const { authenticateJWT } = require('../utils/middleware');
const connection = require('../db');
const { upload } = require('../utils/multerConfig');
const router = express.Router();
const fs = require('fs');

module.exports = (authenticateJWT) => {
	// GET route
	router.get('/boxes', (req, res) => {
		const sql = 'SELECT * FROM boxes';
		connection.query(sql, (err, result) => {
			if (err) {
				res.status(500).json({ error: 'Error fetching boxes' });
			} else {
				res.json(result);
			}
		});
	});

	// POST route
	router.post('/boxes', authenticateJWT, (req, res) => {
		const newBox = {
			weight: req.body.weight,
			content: req.body.content,
			image: req.body.image,
			is_flamable: req.body.is_flamable,
			is_spoilable: req.body.is_spoilable,
			container_id: req.body.container_id,
		};

		const sql = 'INSERT INTO boxes SET ?';
		connection.query(sql, newBox, (err, result) => {
			if (err) {
				res.status(500).json({ error: 'Error creating box' });
			} else {
				res.status(201).json({ message: 'Box created successfully', id: result.insertId });
			}
		});
	});

	// PUT route
	router.put('/boxes/:id', authenticateJWT, (req, res) => {
		const id = req.params.id;
		const updatedBox = {
			weight: req.body.weight,
			content: req.body.content,
			image: req.body.image,
			is_flamable: req.body.is_flamable,
			is_spoilable: req.body.is_spoilable,
			container_id: req.body.container_id,
		};

		const sql = 'UPDATE boxes SET ? WHERE id = ?';
		connection.query(sql, [updatedBox, id], (err, result) => {
			if (err) {
				res.status(500).json({ error: 'Error updating box' });
			} else {
				if (result.affectedRows === 0) {
					res.status(404).json({ message: 'Box not found' });
				} else {
					res.status(200).json({ message: 'Box updated successfully', id: id });
				}
			}
		});
	});

	// DELETE route
	router.delete('/boxes/:id', authenticateJWT, (req, res) => {
		const id = req.params.id;
		const sql = 'DELETE FROM boxes WHERE id = ?';
		connection.query(sql, id, (err, result) => {
			if (err) {
				res.status(500).json({ error: 'Error deleting box' });
			} else {
				if (result.affectedRows === 0) {
					res.status(404).json({ message: 'Box not found' });
				} else {
					res.status(200).json({ message: 'Box deleted successfully', id: id });
				}
			}
		});
	});

	module.exports = router;
};
