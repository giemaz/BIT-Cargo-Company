const express = require('express');
const { authenticateJWT } = require('../utils/middleware');
const connection = require('../db');
const router = express.Router();

module.exports = (authenticateJWT) => {
	// GET route
	router.get('/containers', (req, res) => {
		const sql = 'SELECT * FROM containers';
		connection.query(sql, (err, result) => {
			if (err) {
				res.status(500).json({ error: 'Error fetching containers' });
			} else {
				res.json(result);
			}
		});
	});

	// POST route
	router.post('/containers', authenticateJWT, (req, res) => {
		const newContainer = {
			size: req.body.size,
		};

		const sql = 'INSERT INTO containers SET ?';
		connection.query(sql, newContainer, (err, result) => {
			if (err) {
				res.status(500).json({ error: 'Error creating container' });
			} else {
				res.status(201).json({ message: 'Container created successfully', id: result.insertId });
			}
		});
	});

	// DELETE route to delete a container and its boxes
	router.delete('/containers/:id', authenticateJWT, (req, res) => {
		const containerId = req.params.id;
		connection.beginTransaction((err) => {
			if (err) {
				res.status(500).json({ error: 'Error starting delete ' });
				return;
			}

			// Delete boxes associated with the container
			const deleteBoxesSql = 'DELETE FROM boxes WHERE container_id = ?';
			connection.query(deleteBoxesSql, containerId, (err, result) => {
				if (err) {
					connection.rollback(() => {
						res.status(500).json({ error: 'Error deleting boxes  with the container' });
					});
					return;
				}

				// Delete the container itself
				const deleteContainerSql = 'DELETE FROM containers WHERE id = ?';
				connection.query(deleteContainerSql, containerId, (err, result) => {
					if (err) {
						connection.rollback(() => {
							res.status(500).json({ error: 'Error deleting container' });
						});
						return;
					}

					connection.commit((err) => {
						if (err) {
							connection.rollback(() => {
								res.status(500).json({ error: 'Error deleting !' });
							});
							return;
						}

						res.status(200).json({ message: 'Container and boxes deleted successfully', id: containerId });
					});
				});
			});
		});
	});

	module.exports = router;
};
