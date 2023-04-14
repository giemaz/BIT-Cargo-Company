// server\routes\boxesRoutes.js
const express = require('express');
const { authenticateJWT } = require('../utils/middleware');
const connection = require('../db');
const { upload } = require('../utils/multerConfig');
const fs = require('fs');

const boxesRoutes = function (authenticateJWT) {
	const router = express.Router();
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

	// GET containers boxes
	router.get('/boxes/container/:containerId', (req, res) => {
		const containerId = req.params.containerId;
		const sql = 'SELECT * FROM boxes WHERE container_id = ?';
		connection.query(sql, containerId, (err, result) => {
			if (err) {
				res.status(500).json({ error: 'Error fetching boxes for the container' });
			} else {
				res.json(result);
			}
		});
	});

	// POST route
	router.post('/boxes', authenticateJWT, upload.single('image'), (req, res) => {
		const newBox = {
			weight: req.body.weight,
			content: req.body.content,
			image: req.file ? req.file.path.replace(/\\/g, '/') : null,
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
	router.put('/boxes/:id', authenticateJWT, upload.single('image'), (req, res) => {
		const id = req.params.id;

		connection.query('SELECT * FROM boxes WHERE id = ?', [id], (err, results) => {
			if (err) {
				res.status(500).json({ error: 'Error fetching box' });
				return;
			}

			if (results.length === 0) {
				res.status(404).json({ message: 'Box not found' });
				return;
			}

			const box = results[0];
			const oldImage = box.image;
			const newImage = req.file ? req.file.path.replace(/\\/g, '/') : oldImage;

			const updatedBox = {
				weight: req.body.weight,
				content: req.body.content,
				image: newImage,
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
						if (newImage !== oldImage && oldImage) {
							fs.unlink(oldImage, (err) => {
								if (err) console.error(err);
							});
						}
						res.status(200).json({ message: 'Box updated successfully', id: id });
					}
				}
			});
		});
	});

	// DELETE route
	router.delete('/boxes/:id', authenticateJWT, (req, res) => {
		const id = req.params.id;

		connection.query('SELECT * FROM boxes WHERE id = ?', [id], (err, results) => {
			if (err) {
				res.status(500).json({ error: 'Error fetching box' });
				return;
			}

			if (results.length === 0) {
				res.status(404).json({ message: 'Box not found' });
				return;
			}

			const boxToDelete = results[0];
			const imageToDelete = boxToDelete.image;

			connection.query('DELETE FROM boxes WHERE id = ?', [id], (err, result) => {
				if (err) {
					res.status(500).json({ error: 'Error deleting box' });
				} else {
					if (result.affectedRows === 0) {
						res.status(404).json({ message: 'Box not found' });
					} else {
						if (imageToDelete) {
							fs.unlink(imageToDelete, (err) => {
								if (err) console.error(err);
							});
						}
						res.status(200).json({ message: 'Box deleted successfully', id: id });
					}
				}
			});
		});
	});
	return router;
};

module.exports = boxesRoutes;
